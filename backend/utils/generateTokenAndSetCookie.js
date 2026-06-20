import jwt from "jsonwebtoken"

export const generateTokenAndSetCookie = (res, userId) => {
    const token = jwt.sign({userId}, process.env.JWT_SECRET, {
        expiresIn:"7d",
    });

    const isProduction = process.env.NODE_ENV === "production";
    const isSecureConnection = res.req ? (res.req.secure || res.req.headers['x-forwarded-proto'] === 'https') : false;
    const useSecure = isProduction && isSecureConnection;

    res.cookie("token", token, {
        httpOnly: true,
        secure: useSecure,
        sameSite: useSecure ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return token;
}; 
