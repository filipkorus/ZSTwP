import {useEffect, useState} from 'react';
import {getInquiry} from '@/api/inquiry';
import Inquiry from '@/types/Inquiry.ts';

const MyInquiresPage = () => {
	const [inquires, setInquires] = useState<Array<Inquiry> | null>(null);

	useEffect(() => {
		getInquiry()
			.then(({data}) => setInquires(data))

		return () => {
		};
	}, []);

	return <>
		<pre>{JSON.stringify(inquires,null,3)}</pre>
	</>
};

export default MyInquiresPage;
