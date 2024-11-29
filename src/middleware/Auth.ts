import jwt, { Secret, JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { settings } from "../config/settings";

type CustomRequest = Request & {
    currentUser?: { userId: string; profileId: string };
};

export const auth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token : string | undefined = req.header('Authorization')?.replace('Bearer ', '');
        if (typeof token !== "string" || token.trim() === ""){
            throw new Error();
        }

        const decoded : any = jwt.verify(token, settings.SECRET_KEY);

        const customReq = req as CustomRequest;
        customReq.currentUser = { 
            userId: decoded.userId, 
            profileId: decoded.profileId 
        };
        /*
        req['currentUser'] = { 
            userId: decoded.userId, 
            profileId: decoded.profileId 
        };
        */
        
        next();
    } catch (err) {
        res.status(401).send('Não autenticado');
    }
};