import {PrismaClient, Inquiry} from "@prisma/client";
import logger from '../../utils/logger';

const prisma = new PrismaClient();

/**
 * Returns inquiry object with given user ID.
 *
 * @returns {Promise<Array<Inquiry> | null> | null} Inquiry object or null if error.
 * @param userId {number} User's ID.
 */
export const getInquiryByUserId = (userId: number): Promise<Array<Inquiry> | null> | null => {
	try {
		return prisma.inquiry.findMany({where: {userId: userId}});
	} catch (error) {
		logger.error(error);
		return null;
	}
};

/**
 * Returns inquiry object with given inquiry ID.
 *
 * @returns {Promise<Inquiry|null>|null} Inquiry object or null if error.
 * @param inquiryId {number} Inquiry's ID.
 */
export const getInquiryById = (inquiryId: number): Promise<Inquiry | null> | null => {
	try {
		return prisma.inquiry.findFirst({where: {id: inquiryId}});
	} catch (error) {
		logger.error(error);
		return null;
	}
};

/**
 * Removes inquiry with given inquiry ID. Deleting processing inquiry is impossible.
 * @returns {Promise<boolean>} Boolean indicating success.
 * @param inquiryId {number} Inquiry's ID.
 */
export const deleteInquiryById = async (inquiryId: number): Promise<boolean> => {
	try {
		await prisma.inquiry.delete({where: {
			id: inquiryId,
				OR: [
					{status: 1},
					{status: -1}
				]
		}});
		return true;
	} catch (error) {
		logger.error(error);
		return false;
	}
};

/**
 * Save inquiry data in the database.
 *
 * @returns {Promise<Inquiry|null>} Inquiry object from database or null if error.
 */
export const createInquiry = async ({files, prompt, userId}: {
	files: Array<string>,
	prompt?: string,
	userId: number
}): Promise<Inquiry | null> => {
	let inquiry = null;
	try {
		inquiry = await prisma.inquiry.create({
			data: {
				files: files.join(':'),
				prompt,
				userId
			}
		});
		if (inquiry == null) return null;
	} catch (error) {
		logger.error(error);
		return null;
	}

	return inquiry;
};

/**
 * Updates inquiry data in the database.
 *
 * @returns {Promise<Inquiry|null>} Inquiry object from database or null if error.
 */
export const updateInquiry = async ({inquiryId, prompt, response, status}: {
	inquiryId: number,
	prompt: string,
	response: string,
	status: number
}): Promise<Inquiry | null> => {
	let inquiry = null;
	try {
		inquiry = await prisma.inquiry.update({
			data: {prompt, response, status},
			where: {id: inquiryId}
		});
		if (inquiry == null) return null;
	} catch (error) {
		logger.error(error);
		return null;
	}

	return inquiry;
};
