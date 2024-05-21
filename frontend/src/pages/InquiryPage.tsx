import {useEffect, useState} from 'react';
import {getInquiryById} from '@/api/inquiry';
import Inquiry from '@/types/Inquiry';
import {useParams} from 'react-router-dom';

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

	return <>
		{
			error != null ?
				error :
				<pre>{JSON.stringify(inquiry,null,3)}</pre>
		}
	</>;
};

export default InquiryPage;
