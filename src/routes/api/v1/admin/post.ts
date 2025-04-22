import { Router } from "express";
import { db } from "../../../../database";
import { authMiddleware } from "../../../../service/authMiddleware";
import { User } from "@prisma/client";
import express from 'express';
import { validationMidlerware } from "../../../../service/validationMidleware";

const route = Router()
route.use(express.json())
route.post('/', authMiddleware as any, validationMidlerware as any, async (req, res, next) => {
    try {
        const userData = (req as any).user as User
        const post = await db.post.create({
            data: {
                authorId: userData.id,
                ...req.body
            }
        })

        res.send({
            success: true,
            data: post
        })
    } catch (error) {
        next(error)
    }
})

export default route
