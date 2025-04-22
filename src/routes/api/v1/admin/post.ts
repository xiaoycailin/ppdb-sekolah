import { Router } from "express";
import { authMiddleware } from "../../../../service/authMiddleware";
import { validationMidlerware } from "../../../../service/validationMidleware";
import { db } from "../../../../database";

const route = Router()

route.post('/', authMiddleware as any, validationMidlerware as any, async (req, res, next) => {
    try {
        const body = req.body
       const datacreate = await db.post.create({
            data: {
                content: 'artikel nya apa',
                authorId: (req as any).user.id,
                slug: 'slug nya apa',
                thumbnail: 'thumbnialnya apa',
                title: 'title nya apa'
            }
        })
        res.json({
            success: true,
        })
    } catch (error) {
        next(error)
    }
})


// post data /  create data
// db.post.create({
//     data: {
//         content: 'artikel nya apa',
//         authorId: 'author id nya siapa',
//         slug: 'slug nya apa',
//         thumbnail: 'thumbnialnya apa',
//         title: 'title nya apa'        
//     }
// })

// ini untk update data
// db.post.update({
//     where: {
//         id: 'post id',
//     },
//     data: {
//         title: 'title yang akan di update'
//     }
// })

// ini untuk delete data
// db.post.delete({
//     where: {
//         id: 'postid'
//     }
// })


// ini untuk get data
// db.post.findMany()

// semuanya harus pake await

export default route;