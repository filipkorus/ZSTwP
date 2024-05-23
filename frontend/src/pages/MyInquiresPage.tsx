import {useEffect, useState} from 'react';
import {getInquiry} from '@/api/inquiry';
import Inquiry from '@/types/Inquiry';
import InquiriesList from '@/components/InquiriesList';

const MyInquiresPage = () => {
	const [inquires, setInquires] = useState<Array<Inquiry> | null>(null);

	useEffect(() => {
		getInquiry()
			.then(({data}) => setInquires(data?.inquiries));
	}, []);

	if (inquires == null || inquires.length === 0) {
		return <h3>You do not have any inquires yet...</h3>;
	}

	return <InquiriesList inquiries={inquires} />;
};

export default MyInquiresPage;
