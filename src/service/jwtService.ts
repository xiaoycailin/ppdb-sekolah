import jwt, { SignOptions } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET: string = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN: string | number = process.env.JWT_EXPIRES_IN || '1h';

class JWTService {
    static generateToken(payload: object, expiresIn: any = JWT_EXPIRES_IN): string {
        const options: SignOptions = { expiresIn };
        return jwt.sign(payload, JWT_SECRET, options);
    }

    static verifyToken(token: string): object | null {
        try {
            return jwt.verify(token, JWT_SECRET) as object;
        } catch (error) {
            return null;
        }
    }
}

export default JWTService;
