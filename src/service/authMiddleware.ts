import { User } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { db } from "../database";
import JWTService from "./jwtService";
export interface ReqOptions {
    user: User
}


export const authMiddleware = async (
    req: Request & ReqOptions,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers.authorization?.replace('Bearer ', '');
        console.log({ authHeader });
        if (!authHeader) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const decoded = JWTService.verifyToken(authHeader) as any;
        if (!decoded || typeof decoded !== 'object' || !('id' in decoded)) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        const user = await db.user.findUnique({ where: { id: decoded.id } });
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        req.user = user;
        next();
    } catch (error) {
        next(error);
    }
};
