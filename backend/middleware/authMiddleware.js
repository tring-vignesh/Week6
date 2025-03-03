import jwt from "jsonwebtoken";
import { JWT_SECRET_KEY } from "../utils/auth.js";
const authMiddleware = (token) => {
    if (!token) {
        throw Error("Token not found.Please provide token");
    }
    try {
        token = token.replace("Bearer ", "");
        const decodedToken = jwt.verify(token, JWT_SECRET_KEY);
        return decodedToken;
    }
    catch (error) {
        throw Error("Token is invalid");
    } 
};
export{authMiddleware};