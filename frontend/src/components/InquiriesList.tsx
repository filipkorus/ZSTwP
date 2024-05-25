import React from 'react';
import {List} from '@mui/material';
import Inquiry from '@/types/Inquiry';
import InquiryCard from '@/components/InquiryCard';
import RouterLink from './routing/RouterLink';

type InquiresListProps = {
	inquiries: Array<Inquiry>
};

const InquiriesList: React.FC<InquiresListProps> = ({inquiries}) => {
	return <List>
		{inquiries.map((inquiry, idx) => <RouterLink key={idx} to={`/inquiry/${inquiry.id}`} title={`Click to show Inquiry #${inquiry.id}`}>
			<InquiryCard inquiry={inquiry} />
		</RouterLink>)}
	</List>;
};

export default InquiriesList;
