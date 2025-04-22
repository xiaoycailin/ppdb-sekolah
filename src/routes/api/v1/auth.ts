import { Router } from "express";
import express from 'express';
import bcrypt from 'bcrypt';
import { db } from "../../../database";
import JWTService from "../../../service/jwtService";
import { authMiddleware } from "../../../service/authMiddleware";
import { User } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

const route = Router()

route.use(express.json())

route.post('/login', async (req, res, next) => {
    try {
        const body = req.body
        const getUser = await db.user.findUnique({
            where: {
                whatsApp: body.whatsApp,
            }
        })

        if (!getUser) return res.send({
            success: false,
            message: 'Invalid password or whatsapp number #1'
        })

        const isValidPassword = await bcrypt.compare(body.password, getUser.password)
        if (!isValidPassword) return res.send({
            success: false, message: 'Invalid password or whatsapp number #2'
        })

        const authToken = JWTService.generateToken({
            id: getUser.id,
            fullName: getUser.fullName,
            role: getUser.role,
        })

        res.send({
            success: true,
            data: {
                auth_token: authToken,
            }
        })
    } catch (error) {
        next(error)
    }
})

route.post('/validate-field', async (req, res, next) => {
    try {
        const alisases = {
            fullName: 'Nama Lengkap',
            gender: 'Jenis kelamin',
            nik: 'NIK',
            whatsApp: 'No WhatsApp',
            email: 'Alamat Email'
        }

        const body = req.body
        let key: any
        let value: string | undefined
        for (const k in body) {
            key = k;
            value = body[key];
        }
        if (!key && !value) return res.json({ success: false, message: 'Bad Request' })
        const avail = await db.user.count({
            where: {
                [key]: value
            }
        })
        if (avail > 0) {
            res.send({
                success: false,
                // @ts-ignore
                message: `${alisases[key]} sudah di gunakan!`
            })
        } else {
            res.send({ success: true })
        }
    } catch (error) {
        next(error)
    }
})

route.post('/register', async (req, res, next) => {
    try {
        const body = req.body
        const passwordHash = await bcrypt.hash(body.password, 10)
        const create = await db.user.create({
            data: {
                fullName: body.fullName,
                gender: body.gender,
                nik: body.nik,
                whatsApp: body.whatsApp,
                password: passwordHash,
                role: body.role,
                email: body.email
            }
        })
        res.send({
            success: true,
            message: 'Daftar berhasil'
        })
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            if (error.code == "P2002") {
                res.send({
                    success: false,
                    message: 'Data yang Anda input sudah pernah terdaftar'
                })
            } else {
                next(error)
            }
        } else {
            next(error)
        }
    }
})

route.get('/self', authMiddleware as any, async (req, res, next) => {
    // @ts-ignore
    const user: User = req.user
    res.send({
        success: true,
        data: {
            fullName: user.fullName,
            email: user.email,
            whatsApp: user.whatsApp,
            nik: user.whatsApp,
            gender: user.gender,
            created: user.createdAt,
            status: user.status,
            role: user.role,
        }
    })
})

route.patch('/refresh_token', authMiddleware as any, async (req, res, next) => {
    try {
        // @ts-ignore
        const user: User = req.user
        const authToken = JWTService.generateToken({
            id: user.id,
            fullName: user.fullName,
            role: user.role,
        })

        res.send({
            success: true,
            data: {
                refresh_token: authToken,
            }
        })
    } catch (error) {
        next(error)
    }
})

export default route