import { Router } from "express";
import { db } from "../../../database";

const route = Router()

route.get('/', async (req, res, next) => {
    try {
        const posts = await db.post.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        })
        res.send({
            success: true, data: posts
        })
    } catch (error) {
        next(error)
    }
})


route.get('/:date/:slug', async (req, res, next) => {
    try {
        const { date, slug } = req.params

        const startDate = new Date(`${date}`)
        const endDate = new Date(new Date(startDate).setDate(startDate.getDate() + 1))

        const post = await db.post.findFirst({
            where: {
                createdAt: {
                    gte: startDate,
                    lt: endDate
                },
                slug
            },
            orderBy: {
                createdAt: 'desc'
            }
        })
        if(post) {
            res.send({
                success: true,
                data: post
            })
        }else{
            res.status(404).send({
                success: false,
                message: 'Post Not Found'
            })
        }
    } catch (error) {
        next(error)
    }
})


export default route