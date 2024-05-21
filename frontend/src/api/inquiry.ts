import api from '@/api';

export const getInquiryById = (inquiryId: number) => api.get(`/inquiry/${inquiryId}`);

export const deleteInquiryById = (inquiryId: number) => api.delete(`/inquiry/${inquiryId}`);

export const getInquiry = () => api.get(`/inquiry`);

export const uploadInquiry = (formData: FormData) => api.post('/inquiry', formData, {headers: {
	'Content-Type': 'multipart/form-data',
}});
