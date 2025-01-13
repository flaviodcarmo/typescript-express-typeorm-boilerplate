import jwt, { Secret, JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { settings } from "../config/settings";
import { constants } from "../util/Constants";
import Result from "../util/Result";

import UserBO from "../business/UserBO";
import User from "../entities/User";

type CustomRequest = Request &
{
    currentUser?: { userId: string; profileId: string };
};

export const auth = 
{
    requireLogin: async (req: Request, res: Response, next: NextFunction) : Promise<Result> => {
        try {
            let user : any;
            let userBO : UserBO = new UserBO(new User());

            const token : string | undefined = req.header('Authorization')?.replace('Bearer ', '');
            if (typeof token !== "string" || token.trim() === ""){
                throw new Error('Você não está logado.');
            }
    
            const decoded : any = jwt.verify(token, settings.SECRET_KEY);

            const customReq = req as CustomRequest;
            customReq.currentUser = { 
                userId: decoded.userId, 
                profileId: decoded.profileId 
            };

            req = customReq;

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
            
            return Result.success;
        } catch (e) {
            return Result.returnError((e as Error).message, 401);
        }
    },

    requireAdministrator: async (req: Request, res: Response, next: NextFunction): Promise<Result> => {
        try {
            let user : any;
            let userBO : UserBO = new UserBO(new User());

            const token : string | undefined = req.header('Authorization')?.replace('Bearer ', '');
            if(typeof token !== "string" || token.trim() === ""){
                throw new Error();
            }
    
            const decoded : any = jwt.verify(token, settings.SECRET_KEY);

            const customReq = req as CustomRequest;
            customReq.currentUser = { 
                userId: decoded.userId, 
                profileId: decoded.profileId 
            };

            req = customReq;

            if(
                decoded.userId && 
                typeof decoded.userId === 'string' && 
                decoded.userId !== '' &&
                decoded.profileId && 
                typeof decoded.profileId === 'string' && 
                decoded.profileId !== ''
            ) {
                user = (await userBO.searchAll({ id: decoded.userId, profileId: decoded.profileId }))[0];
                if (user === undefined) {
                    throw new Error('Erro ao buscar o usuário.');
                }
            } else {
                throw new Error('Erro ao buscar o usuário.');
            }

            if (customReq.currentUser.profileId !== constants.profile.ADMINISTRATOR_ID) {
                return Result.returnError('Você não tem permissão para acessar essa rota.', 405);
            }
            
            return Result.success;
        } catch (e) {
            return Result.returnError((e as Error).message, 401);
        }
    },
}
