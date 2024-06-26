import { useDropzone } from 'react-dropzone';
import {Alert, Box, Button, TextField, Typography } from '@mui/material';
import { styled } from '@mui/system';
import {useState} from 'react';
import {uploadInquiry} from '@/api/inquiry';
import {AxiosError} from 'axios';
import {useNavigate} from 'react-router-dom';

const DropzoneContainer = styled(Box)(({ theme }) => ({
	border: '2px dashed #ccc',
	padding: theme.spacing(2),
	textAlign: 'center',
	cursor: 'pointer',
	'&:hover': {
		borderColor: '#aaa',
	},
}));

const FileList = styled(Box)(({ theme }) => ({
	marginTop: theme.spacing(2),
}));

const FileItem = styled(Typography)(({ theme }) => ({
	marginTop: theme.spacing(1),
}));

const CreateInquiryPage = () => {
	const [files, setFiles] = useState<File[]>([]);
	const [customPrompt, setCustomPrompt] = useState<string>('');
	const [successMsg, setSuccessMsg] = useState<string>('');
	const [errorMsg, setErrorMsg] = useState<string>('');

	const navigate = useNavigate();

	const { getRootProps, getInputProps } = useDropzone({
		accept: {
			'application/pdf': ['.pdf']
		},
		onDrop: (acceptedFiles) => setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]),
	});

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();

		const formData = new FormData();

		const prompt = customPrompt.trim();
		if (prompt.length !== 0) {
			formData.append('prompt', prompt);
		}

		files.forEach((file, idx) => formData.append(`file${idx+1}`, file));

		try {
			const {data, status} = await uploadInquiry(formData);
			if (data?.success) {
				setErrorMsg('');
				setSuccessMsg(data?.msg);

				setFiles([]);
				setCustomPrompt('');

				const timeout = setTimeout(() => {
					const id = data?.inquiry.id;
					navigate(`/inquiry/${id}`);
					clearTimeout(timeout);
				}, 4_000);
			} else {
				setSuccessMsg('');
				setErrorMsg(data?.msg);
			}
		} catch (err) {
			console.error(err);
			if (!(err instanceof AxiosError)) return;

			setSuccessMsg('');
			setErrorMsg(err.response?.data?.msg);
		}
	};

	return <Box component="form" onSubmit={handleSubmit} sx={{ width: 400, mx: 'auto', mt: 5 }}>
		{successMsg !== '' &&
			 <Alert severity="success" style={{margin: '1rem 0'}}>{successMsg}</Alert>
		}

		{errorMsg !== '' &&
          <Alert severity="error" style={{margin: '1rem 0'}}>{errorMsg}</Alert>
		}
		<DropzoneContainer {...getRootProps()}>
			<input {...getInputProps()} />
			<Typography>Drag and drop PDF files here, or click to select them</Typography>
		</DropzoneContainer>
		<FileList style={{paddingLeft: '1rem', marginBottom: '1rem'}}>
			{files.map((file, idx) => <FileItem key={idx}>{file.name}</FileItem>)}
		</FileList>
		<TextField
			label="Custom prompt (optional)"
			variant="outlined"
			fullWidth
			margin="normal"
			value={customPrompt}
			onChange={(e) => setCustomPrompt(e.target.value)}
		/>
		<Button type="submit" variant="contained" color="primary" fullWidth>
			Submit
		</Button>
	</Box>;
};

export default CreateInquiryPage;
