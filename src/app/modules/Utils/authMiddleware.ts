import { Response, NextFunction } from 'express';
import jwt, { JwtPayload, TokenExpiredError } from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import AppError from '../Error/AppError';
import config from '../../config';
import { userService } from '../Users/user.service';
import { AuthenticatedRequest } from '../listings/listing.controller';

export const verifyToken = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const { authorization } = req.headers;
        if (!authorization) {
            throw new AppError(StatusCodes.UNAUTHORIZED, 'Authorization token is required');
        }

        try {
            const decoded = jwt.verify(
                authorization,
                config.jwt_access_secret as string
            ) as JwtPayload & { email: string; role: string };

            const { email } = decoded;

            const user = await userService.getSingleUserById(email);

            if (!user) {
                throw new AppError(
                    StatusCodes.NOT_FOUND,
                    'This user is not found!'
                );
            }

            req.user = decoded; // ✅ এখন টাইপ ম্যাচ করবে

            next();
        } catch (error) {
            if (error instanceof TokenExpiredError) {
                return next(
                    new AppError(
                        StatusCodes.UNAUTHORIZED,
                        'Token has expired! Please login again.'
                    )
                );
            }
            return next(
                new AppError(StatusCodes.UNAUTHORIZED, 'Invalid token!')
            );
        }
    } catch (error) {
        next(error);
    }
};

