import {Request, Response} from 'express';
import path from 'path';
import {BAD_REQUEST, NOT_FOUND, SERVER_ERROR, SUCCESS} from '../../utils/httpCodeResponses/messages';
import {createInquiry, deleteInquiryById, getInquiryById, getInquiryByUserId, updateInquiry} from './inquiry.service';
import {v4 as uuidv4} from 'uuid';
import {UploadedFile} from 'express-fileupload';
import axios from 'axios';
import config from '../../../config';
import logger from '../../utils/logger';
import deleteFile from '../../utils/deleteFile';

export const GetInquiryHandler = async (req: Request, res: Response) => {
	const inquiries = await getInquiryByUserId(+res.locals.user.id);
	if (inquiries == null) {
		return NOT_FOUND(res, `No inquiries found yet`);
	}
	return SUCCESS(res, 'Inquiries data fetched successfully', inquiries);
};

export const GetInquiryByIdHandler = async (req: Request, res: Response) => {
	const {id: inquiryId} = req.params;

	if (inquiryId == null || !Number.isInteger(Number(inquiryId))) {
		return BAD_REQUEST(res, 'Invalid or missing \'inquiryId\' param');
	}

	const inquiry = await getInquiryById(+inquiryId);
	if (inquiry == null) {
		return NOT_FOUND(res, `Inquiry with ID = ${inquiryId} does not exist`);
	}

	return SUCCESS(res, 'Inquiry data fetched successfully', {inquiry});
};

export const DeleteInquiryByIdHandler = async (req: Request, res: Response) => {
	const {id: inquiryId} = req.params;

	if (inquiryId == null || !Number.isInteger(Number(inquiryId))) {
		return BAD_REQUEST(res, 'Invalid or missing \'inquiryId\' param');
	}

	const inquiry = await getInquiryById(+inquiryId);
	if (inquiry == null || inquiry.userId !== res.locals.user.id) {
		return NOT_FOUND(res, `Inquiry with ID = ${inquiryId} does not exist`);
	}

	if (inquiry.status === 0) {
		return BAD_REQUEST(res, 'Cannot delete inquiry which is being processed. Try again later.');
	}

	const deleted = await deleteInquiryById(+inquiryId);
	if (!deleted) {
		return SERVER_ERROR(res, 'Server error. Inquiry has not been deleted.');
	}

	return SUCCESS(res, 'Inquiry deleted successfully', {inquiry});
};

export const CreateInquiryHandler = async (req: Request, res: Response) => {
	if (req.files == null) {
		return BAD_REQUEST(res, 'No files has been supplied!');
	}

	const {prompt} = req.body;
	if (prompt != null && typeof prompt != 'string') {
		return BAD_REQUEST(res, 'Prompt must be a string!');
	}

	if (prompt != null && prompt.trim().length === 0) {
		return BAD_REQUEST(res, 'Invalid prompt!');
	}

	const {files} = req;
	const filesProperties: Array<{name: string, url: string, size: number, mimetype: string}> = [];
	const deleteFiles = () => filesProperties.forEach(file => deleteFile(config.FILE_UPLOAD_LOCATION + file.url));
	let errorOccurred = false;

	for (let i = 1; i <= config.MAX_NUM_FILES_TO_UPLOAD; ++i) {
		const file = files[`file${i}`] as UploadedFile | null;

		if (file == null || errorOccurred) { // no more files
			break;
		}

		if (file.mimetype !== 'application/pdf') {
			return BAD_REQUEST(res, `File '${file.name}' is not a PDF file.`);
		}

		// for future use
		const fileSizeInGB = file.size / 1_000_000_000;

		const fileExt = path.extname(file.name).slice(1).toLowerCase();
		const uniqueFilename = uuidv4() + '.' + fileExt; // generate random filename

		file.mv(config.FILE_UPLOAD_LOCATION + '/' + uniqueFilename, async err => {
			if (err) {
				logger.error(err);
				errorOccurred = true;
				return SERVER_ERROR(res, 'Error when uploading file.');
			}
		});

		filesProperties.push({
			...file,
			url: uniqueFilename
		});
	}

	if (errorOccurred) {
		deleteFiles();

		return; // without response because it was sent inside callback few lines above
	}

	const inquiry = await createInquiry({
		files: filesProperties.map(file => file.name),
		prompt,
		userId: res.locals.user.id
	});

	if (inquiry == null) {
		deleteFiles();

		return SERVER_ERROR(res, 'Database error');
	}

	SUCCESS(res, 'Files uploaded successfully.');

	const pdf_files = filesProperties.map(file => ({
		name: file.name.replace(' ', '-').replace('.', '-'),
		url: file.url
	}));

	const result: {prompt: string, response: string} = {prompt: '', response: ''};

	let pdfAnalyzerApiErrorOccurred = false;
	try {
		const {data, status} = await axios.post(`${config.PDF_ANALYZER_API_URL}/check_inquiry/`, {
			pdf_files,
			custom_question: prompt != null ? prompt : undefined
		});
		result.prompt = data?.input?.question ?? '';
		result.response = data?.output ?? '';
	} catch (error) {
		logger.error(error);
		pdfAnalyzerApiErrorOccurred = true;
	}

	if (pdfAnalyzerApiErrorOccurred) {
		try {
			await updateInquiry({
				...result,
				inquiryId: inquiry.id,
				status: -1 // -1 means error
			})
		} catch (error) {
			logger.error(error);
		}

		deleteFiles();

		return;
	}

	const updatedInquiry = await updateInquiry({
		...result,
		inquiryId: inquiry.id,
		status: 1 // 1 means success, 0 means processing, -1 means error
	});

	deleteFiles();
};
