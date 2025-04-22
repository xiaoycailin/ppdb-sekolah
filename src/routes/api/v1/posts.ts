import { Router } from "express";
import { db } from "../../../database";
import { levenshteinEditDistance } from 'levenshtein-edit-distance'

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

route.get('/search', async (req, res, next) => {
    try {
        const rawQuery = (req.query.s as string).toLowerCase().trim()
        const queryWords = rawQuery.split(/\s+/)
        const queryNoSpace = rawQuery.replace(/\s+/g, '')

        const posts = await db.post.findMany({
            orderBy: { createdAt: 'desc' }
        })

        const filteredPosts = posts.filter(post => {
            const combinedFields = `
                ${post.title || ''}
                ${post.slug || ''}
                ${post.content || ''}
            `.toLowerCase().trim()

            const combinedWords = combinedFields.split(/\s+/)
            const combinedNoSpace = combinedFields.replace(/\s+/g, '')

            // Cek kombinasi fuzzy match
            const isMatch = queryWords.some(queryWord =>
                combinedWords.some(fieldWord =>
                    levenshteinEditDistance(queryWord, fieldWord) <= 2 || fieldWord.includes(queryWord)
                )
            ) || combinedNoSpace.includes(queryNoSpace) || levenshteinEditDistance(queryNoSpace, combinedNoSpace) <= 2

            return isMatch
        })

        res.send({
            success: true,
            data: filteredPosts
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
        if (post) {
            res.send({
                success: true,
                data: post
            })
        } else {
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