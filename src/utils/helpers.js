// Validate URL format
export function isValidURL(string) {
    try {
        const url = new URL(string);
        return url.protocol === 'http:' || url.protocol === 'https:';
    } catch (_) {
        return false;
    }
}

// Get redirect URL
export function getRedirectURL(domain, slug) {
    return `https://${domain}/r/${slug}`;
}

// Extract IP from request headers (considering Cloudflare headers)
export function getClientIP(request) {
    return request.headers.get('CF-Connecting-IP') ||
        request.headers.get('X-Forwarded-For') ||
        request.headers.get('X-Real-IP') ||
        'Unknown';
}

// Get user agent from request
export function getUserAgent(request) {
    return request.headers.get('User-Agent') || 'Unknown';
}

// Get referer from request
export function getReferer(request) {
    return request.headers.get('Referer') || request.headers.get('Referrer') || '';
} 