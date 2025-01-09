import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.SECRET_KEY || 'aksjdkl2aj3djaklfji32dj2dj9ld92jd92j';

export const validateToken = (req: Request, res: Response): void => {
  const { token } = req.body;

  if (!token) {
    res.status(400).json({
      success: false,
      message: 'Token is required',
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);

    res.status(200).json({
      success: true,
      message: 'Token is valid',
      data: decoded,
    }); 
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
    });
    return;
  }
};