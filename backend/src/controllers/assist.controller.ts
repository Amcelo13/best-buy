import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { AssistFormData } from '../types/assist.types';
import { submitAssistForm as submitAssistFormService } from '../services/ratePlanService';

// In a real application, you would use a database
const submissions: AssistFormData[] = [];

export const submitAssistForm = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Use the rate plan service to handle the form submission
  return submitAssistFormService(req, res, next);
};

export const getAssistSubmissions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // In a real app, you would fetch from a database with pagination
    return res.status(StatusCodes.OK).json({
      success: true,
      data: submissions,
      count: submissions.length
    });
  } catch (error) {
    next(error);
  }
};

export const getAssistSubmissionById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const submission = submissions.find(sub => sub.id === id);
    
    if (!submission) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Submission not found'
      });
    }
    
    return res.status(StatusCodes.OK).json({
      success: true,
      data: submission
    });
  } catch (error) {
    next(error);
  }
};
