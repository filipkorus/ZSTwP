import {useEffect, useState} from 'react';
import {getInquiryById} from '@/api/inquiry';
import Inquiry from '@/types/Inquiry';
import {useParams} from 'react-router-dom';
import InquiryCard from '@/components/InquiryCard';
import RouterLink from '@/components/routing/RouterLink';

const InquiryPage = () => {
	const [inquiry, setInquiry] = useState<Inquiry | null>(null);
	const [error, setError] = useState<string | null>(null);

	const {id: inquiryId} = useParams();

	useEffect(() => {
		if (inquiryId == null) return;

		getInquiryById(+inquiryId)
			.then(({data}) => setInquiry(data?.inquiry))
			.catch(err => setError(err?.response?.data?.msg ?? `No inquiry with ID ${inquiryId} found`));
	}, [inquiryId]);

	useEffect(() => {
		if (inquiryId == null) return;
		if (inquiry == null) return;
		if (inquiry.status !== 0) return;

		const interval = setInterval(() => {
			getInquiryById(+inquiryId)
				.then(({data}) => {
					if (data.inquiry.status !== 0) return;

					setInquiry(data?.inquiry);
					clearInterval(interval);
				})
				.catch(err => {});
		}, 5_000);

		return () => {
			if (!interval) return;

			clearInterval(interval);
		};
	}, [inquiryId, inquiry]);

	if (inquiry == null) {
		return <>
			<h3>Inquiry #{inquiryId} not found</h3>
			<RouterLink to="/inquires">Click here to go to inquires list</RouterLink>
		</>;
	}

	if (error != null) {
		return <h3>{error}</h3>;
	}

	return <InquiryCard inquiry={inquiry} displayResponse/>;
};

export default InquiryPage;
