import jwt, { Secret, JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { settings } from "../config/Settings";
import { constants } from "../util/Constants";

import UserBO from "../business/UserBO";

export const auth = 
{
    requireLogin: async (req: Request, res: Response, next: NextFunction) => {
        try {
            let user : any;
            let userBO : UserBO = new UserBO(null);

            const token : string = req.header('Authorization')?.replace('Bearer ', '');
            if(typeof token !== "string" || token.trim() === ""){
                throw new Error('Você não está logado.');
            }
    
            const decoded : any = jwt.verify(token, settings.SECRET_KEY);
            req['currentUser'] = { 
                userId: decoded.userId, 
                profileId: decoded.profileId 
            };

            if(
                decoded.userId && 
                typeof decoded.userId === 'string' && 
                decoded.userId !== '' &&
                decoded.profileId && 
                typeof decoded.profileId === 'string' && 
                decoded.profileId !== ''
            ) {
                user = (await userBO.searchAll({ id: decoded.userId, profileId: decoded.profileId }))[0];
                if(user === undefined) {
                    throw new Error('Erro ao buscar o usuário.');
                }
            } else {
                throw new Error('Erro ao buscar o usuário.');
            }
            
            next();
        } catch (e) {
            res.status(401).json([e.message]);
        }
    },

    requireAdministrator: async (req: Request, res: Response, next: NextFunction) => {
        try {
            let user : any;
            let userBO : UserBO = new UserBO(null);

            const token : string = req.header('Authorization')?.replace('Bearer ', '');
            if(typeof token !== "string" || token.trim() === ""){
                throw new Error();
            }
    
            const decoded : any = jwt.verify(token, settings.SECRET_KEY);
            req['currentUser'] = { 
                userId: decoded.userId, 
                profileId: decoded.profileId 
            };

            if(
                decoded.userId && 
                typeof decoded.userId === 'string' && 
                decoded.userId !== '' &&
                decoded.profileId && 
                typeof decoded.profileId === 'string' && 
                decoded.profileId !== ''
            ) {
                user = (await userBO.searchAll({ id: decoded.userId, profileId: decoded.profileId }))[0];
                if(user === undefined) {
                    throw new Error('Erro ao buscar o usuário.');
                }
            } else {
                throw new Error('Erro ao buscar o usuário.');
            }

            if(req['currentUser'].profileId !== constants.profile.ADMINISTRATOR_ID) {
                return res.status(405).json(['Você não tem permissão para acessar essa rota.']);
            }
            
            next();
        } catch (e) {
            res.status(401).json([e.message]);
        }
    },
}
