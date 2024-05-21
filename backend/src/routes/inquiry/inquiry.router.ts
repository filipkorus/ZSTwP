import {Router} from 'express';
import {
	GetInquiryByIdHandler,
	GetInquiryHandler,
	CreateInquiryHandler,
	DeleteInquiryByIdHandler
} from './inquiry.controller';

const router = Router();

router.get('/:id', GetInquiryByIdHandler);
router.delete('/:id', DeleteInquiryByIdHandler);
router.get('/', GetInquiryHandler);
router.post('/', CreateInquiryHandler);

export default router;
