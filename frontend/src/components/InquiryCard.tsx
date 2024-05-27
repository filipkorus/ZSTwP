import React from 'react';
import {Box, Chip, Divider, ListItem, ListItemText, Typography} from '@mui/material';
import RouterLink from '@/components/routing/RouterLink';
import Inquiry from '@/types/Inquiry';
import {IconButton} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import {deleteInquiryById} from '@/api/inquiry';
import {AxiosError} from 'axios';
import {useNavigate} from 'react-router-dom';

type InquiryProps = {
	inquiry: Inquiry,
	displayResponse?: boolean
};

const InquiryCard: React.FC<InquiryProps> = ({inquiry, displayResponse}) => {
	const navigate = useNavigate();
	const formatDate2 = (dateString: Date) => {
		const options: Intl.DateTimeFormatOptions = {year: 'numeric', month: 'long', day: 'numeric'};
		return new Date(dateString).toLocaleDateString(undefined, options);
	};

	type Status = -1 | 0 | 1;
	const inquiryStatusLabel = (status: Status) => {
		if (status === 0) return 'Pending';
		if (status === 1) return 'Completed';
		if (status === -1) return 'Error';
	};

	const inquiryStatusColor = (status: Status) => {
		if (status === 0) return 'warning';
		if (status === 1) return 'success';
		if (status === -1) return 'error';
	};

	const deleteInquiry = async () => {
		if (inquiry.status === 0) return; // cannot delete pending inquiries

		const deleteConfirmed = confirm(`Are you sure to delete Inquiry #${inquiry.id}?`);

		if (!deleteConfirmed) return;

		try {
			const {data} = await deleteInquiryById(inquiry.id);
			if (!data?.success) alert('Error');

			navigate('/inquires');
		} catch (err) {
			console.error(err);
			if (!(err instanceof AxiosError)) return;

			alert(err.response?.data?.msg ?? 'Error');
		}
	};

	return <Box mb={2}>
		<ListItem alignItems="flex-start">
			<ListItemText
				primary={
					<>
						<Box display="flex">
							<Typography variant="h6" component="span">
								<RouterLink to={`/inquiry/${inquiry.id}`}>
									Inquiry #{inquiry.id}
								</RouterLink>
							</Typography>
							<Box ml={1}>
								<Chip
									label={inquiryStatusLabel(inquiry.status as Status)}
									color={inquiryStatusColor(inquiry.status as Status)}
								/>
							</Box>
							{displayResponse && inquiry.status !== 0 &&
                         <Box>
                             <IconButton
                                 color="error"
                                 onClick={deleteInquiry}
                             >
                                 <DeleteIcon/>
                             </IconButton>
                         </Box>
							}
						</Box>

						<Box>
							<Typography variant="body2" color="textSecondary">{formatDate2(inquiry.createdAt)}</Typography>
							<Typography
								sx={{display: 'inline'}}
								component="span"
								variant="body2"
								color="text.primary"
							>
								{inquiry.files.split(':').join(', ')}
							</Typography>
							<Typography variant="caption" component="p" gutterBottom>
								Prompt: {inquiry.prompt || 'No prompt provided'}
							</Typography>
							{displayResponse && inquiryStatusColor(inquiry.status as Status) !== 'error' &&
                         <Typography component="p" gutterBottom dangerouslySetInnerHTML={{__html: inquiry.response || 'Waiting for response...'}}></Typography>
							}
						</Box>
					</>
				}
			/>
		</ListItem>
		{!displayResponse && <Divider component="li"/>}
	</Box>;
};

export default InquiryCard;
