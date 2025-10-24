import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { AssistFormData } from '../types/assist.types';

// In a real application, you would use a database
const submissions: AssistFormData[] = [];

export const submitAssistForm = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const formData: AssistFormData = req.body;
    console.log('Form Data:', formData);
    // Basic validation
    if (!formData.selectedProvider || !formData.customerType || !formData.providerType) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // In a real app, you would save to a database here
    submissions.push(formData);
    
    // Return the created submission with an ID
    const submission = {
      id: Date.now().toString(),
      ...formData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    return res.status(StatusCodes.CREATED).json({
      success: true,
      data: submission
    });
  } catch (error) {
    next(error);
  }
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
