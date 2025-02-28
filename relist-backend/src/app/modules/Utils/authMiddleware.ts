import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload, TokenExpiredError } from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import AppError from '../Error/AppError';
import config from '../../config';
import { userService } from '../Users/user.service';

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { authorization } = req.headers
        if (!authorization) {
            throw new AppError(StatusCodes.UNAUTHORIZED, 'Authorization token is required');
        }
        // Verify the token using JWT_SECRET
        try {
            const decoded = jwt.verify(
                authorization,
                config.jwt_access_secret as string
            ) as JwtPayload;

            const { email } = decoded;
            console.log(email);

            const user = await userService.getSingleUserById(email);

            if (!user) {
                throw new AppError(
                    StatusCodes.NOT_FOUND,
                    'This user is not found!'
                );
            }

            console.log(user);
            req.user = decoded as JwtPayload & { role: string };
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
