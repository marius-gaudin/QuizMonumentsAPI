import jwt from 'jsonwebtoken';

export function getCurrentUserIdByToken(token) {
    if(typeof token !== 'string') return null
    token = token.slice(token.indexOf(' ')+1)
    const tokenInfo = jwt.verify(token, process.env.JWT_SECRET)
    return tokenInfo?.data?._id
}