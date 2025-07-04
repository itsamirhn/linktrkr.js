import { SignJWT, jwtVerify } from 'jose';

export class JWTService {
    constructor(secretKey) {
        this.secretKey = new TextEncoder().encode(secretKey);
    }

    async encode(data, expiry = null) {
        try {
            const payload = { data: JSON.stringify(data) };

            let jwt = new SignJWT(payload)
                .setProtectedHeader({ alg: 'HS256' })
                .setIssuedAt();

            if (expiry) {
                jwt = jwt.setExpirationTime(Math.floor(Date.now() / 1000) + expiry);
            }

            return await jwt.sign(this.secretKey);
        } catch (error) {
            throw new Error(`Failed to encode JWT: ${error.message}`);
        }
    }

    async decode(tokenString) {
        try {
            const { payload } = await jwtVerify(tokenString, this.secretKey);

            if (!payload.data) {
                throw new Error('Invalid data format in token');
            }

            return JSON.parse(payload.data);
        } catch (error) {
            throw new Error(`Failed to decode JWT: ${error.message}`);
        }
    }
} 