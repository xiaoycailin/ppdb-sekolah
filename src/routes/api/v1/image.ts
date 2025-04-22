import { Router } from "express";
import express from 'express';
import { db } from '../../../database/index';

const route = Router()

route.post('/', express.json(), async (req, res, next) => {
    try {
        const body = req.body
        const image = await db.image.create({
            data: {
                imageContent: body.image,
                type: 'BASE64'
            }
        })
        const mimeType = image.imageContent.split(';')[0].split(':')[1];
        res.setHeader('Content-Type', mimeType);
        res.send(Buffer.from(image.imageContent.split(',')[1], 'base64'));
    } catch (error) {
        next(error)
    }
})

route.get('/base64/:imageid', async (req, res, next) => {
    try {
        const image = await db.image.findUniqueOrThrow({ where: { id: req.params.imageid } });

        const mimeType = image.imageContent.split(';')[0].split(':')[1];
        const base64Data = image.imageContent.split(',')[1];

        res.setHeader('Content-Type', mimeType);

        // Allow public caching for 7 days (604800 seconds)
        res.setHeader('Cache-Control', 'public, max-age=604800, immutable');

        res.send(Buffer.from(base64Data, 'base64'));
    } catch (error) {
        next(error);
    }
});

export default route