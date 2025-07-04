import { SignJWT, jwtVerify } from 'jose';

export function isValidURL(string) {
    try {
        const url = new URL(string);
        return url.protocol === 'http:' || url.protocol === 'https:';
    } catch (_) {
        return false;
    }
}

export function getRedirectURL(domain, slug) {
    return `https://${domain}/r/${slug}`;
}

export function getClientIP(request) {
    return request.headers.get('CF-Connecting-IP') ||
        request.headers.get('X-Forwarded-For') ||
        request.headers.get('X-Real-IP') ||
        'Unknown';
}

export function getUserAgent(request) {
    return request.headers.get('User-Agent') || 'Unknown';
}

export function getReferer(request) {
    return request.headers.get('Referer') || request.headers.get('Referrer') || '';
}

export async function encodeJWT(data, secretKey) {
    const secret = new TextEncoder().encode(secretKey);
    const payload = { data: JSON.stringify(data) };

    return await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .sign(secret);
}

export async function decodeJWT(tokenString, secretKey) {
    const secret = new TextEncoder().encode(secretKey);
    const { payload } = await jwtVerify(tokenString, secret);
    return JSON.parse(payload.data);
} 