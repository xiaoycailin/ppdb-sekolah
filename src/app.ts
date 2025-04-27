
import express, { NextFunction, Request, Response } from 'express'
// import cors from "cors"
import { ResponseError } from './models/Response'
import { loaders } from './utils'
// import routersLoader from './lib/routesLoader'

const app = express()
const port = parseInt(process.env.SERVER_PORT || "8564")
const host = process.env.SERVER_HOST || "0.0.0.0"
// app.use(cors({
//     origin: [],
//     credentials: true
// }))
app.set("trust proxy", true);

loaders(app).then(exp => {
    exp.use((err: ResponseError, req: Request, res: Response, next: NextFunction) => {
        res.statusMessage = err.name
        if (err instanceof RangeError) {
            return res.status(500).json({ code: err.code, name: err.name, error: err.message })
        }
        res.status(err.code == undefined ? 500 : typeof err.code !== 'number' ? 500 : err.code).json({ code: err.code, name: err.name, error: err.message })
    })

    exp.use('*', (req, res) => {
        res.status(404).send({
            success: false,
            message: 'Not Found'
        })
    })
})



app.listen(port, host, () => {
    console.log(`Server running on http://${host}:${port}`)
})

