import jwt from 'jsonwebtoken';

export const generateTestJwt = (userId: number, email: string) => {
    const payload = {
        userId,
        email,
        iat: Date.now(),
        exp: Date.now() + 1000 * 60 * 60 * 24 * 7
    }
    return jwt.sign(payload, 'testSecret');
}
