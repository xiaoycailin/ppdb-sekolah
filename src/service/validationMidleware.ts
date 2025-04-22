
import { ReqOptions } from "./authMiddleware";
import { NextFunction, Request, Response } from "express";


export const validationMidlerware = async (
    req: Request & ReqOptions,
    res: Response,
    next: NextFunction
) => {
    try {
        const role = req.user.role
        if (role !== "ADMIN") return res.status(403).json({ success: false, message: 'Access Forbiden' })
        next();
    } catch (error) {
        next(error);
    }
};