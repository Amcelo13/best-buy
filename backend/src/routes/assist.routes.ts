import { Router } from 'express';
import { 
  submitAssistForm, 
  getAssistSubmissions, 
  getAssistSubmissionById 
} from '../controllers/assist.controller';

const router = Router();

// Submit new assist form
router.post('/', submitAssistForm);

// Get all assist form submissions
router.get('/', getAssistSubmissions);

// Get single assist form submission
router.get('/:id', getAssistSubmissionById);

export default router;
