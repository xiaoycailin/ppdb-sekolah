import { Router } from "express";
import { authMiddleware } from "../../../../service/authMiddleware";
import { db } from "../../../../database";
import { validationMidlerware } from "../../../../service/validationMidleware";
import express from 'express';

const route = Router()

route.use(express.json())
route.get('/', authMiddleware as any, validationMidlerware as any, async (req, res, next) => {
    try {
        const q = req.query
        const users = await db.user.findMany({ where: q, include: { metaData: true } })
        res.send({
            success: true,
            query: q,
            data: users.map(user => ({
                ...user,
                password: undefined,
                metadataId: undefined,
            }))
        })
    } catch (error) {
        next(error)
    }
})

route.patch('/:userid', authMiddleware as any, validationMidlerware as any, async (req, res, next) => {
    try {
        const body = req.body
        const user = await db.user.update({
            where: { id: req.params.userid }, data: {
                status: body.status
            }
        })
        res.send({
            success: true,
            data: user
        })
    } catch (error) {
        next(error)
    }
})

export default route
