import { Router } from "express";
import { authMiddleware } from "../../../../service/authMiddleware";
import { db } from "../../../../database";

const route = Router()

route.get('/', authMiddleware as any, async (req, res, next) => {
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

export default route
