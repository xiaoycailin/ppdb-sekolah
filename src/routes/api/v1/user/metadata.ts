
import { Router } from "express";
import { authMiddleware } from "../../../../service/authMiddleware";
import { db } from "../../../../database";
import { User } from "@prisma/client";
import express from 'express';

const route = Router()
route.use(express.json())
route.get('/', authMiddleware as any, async (req, res, next) => {
    try {
        const userData = (req as any).user as User
        const user = await db.user.findUnique({ where: { id: userData.id }, include: { metaData: true } })
        res.send({
            success: true,
            data: {
                ...user,
                password: undefined,
                metadataId: undefined,
            }
        })
    } catch (error) {
        next(error)
    }
})

route.patch('/', authMiddleware as any, async (req, res, next) => {
    try {
        const userData = (req as any).user as User

        const user = await db.user.findUnique({
            where: { id: userData.id },
            include: { metaData: true }
        })

        const metadataInput = user?.metaData
            ? { update: req.body.metadata }
            : { create: { ...req.body.metadata, userId: userData.id } }

        await db.user.update({
            where: { id: userData.id },
            data: { metaData: metadataInput }
        })

        const finalFindUser = await db.user.findUnique({ where: { id: userData.id }, include: { metaData: true, } })
        res.send({
            success: true,
            data: {
                ...finalFindUser,
                password: undefined,
                metadataId: undefined
            }
        })
    } catch (error) {
        next(error)
    }
})

export default route