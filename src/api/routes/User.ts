import { Request, Response, Router } from 'express';
import UserController from "../controllers/UserController";
import { auth } from '../../middleware/Auth';

const router : Router = Router();

router.get('/api/1/users', auth.requireLogin, async (req: Request, res: Response) => {
    return await new UserController(req, res).getByParameters();
});

router.get('/api/1/users/:id', auth.requireLogin, async (req: Request, res: Response) => {
    return await new UserController(req, res).getById();
});

router.post('/api/1/users', async (req: Request, res: Response) => {
    return await new UserController(req, res).signup();
});

router.post('/api/1/users/:id/confirm', async (req: Request, res: Response) => {
    return await new UserController(req, res).confirm();
});

router.post('/api/1/users/auth', async (req: Request, res: Response) => {
    return await new UserController(req, res).auth();
});

export default router;