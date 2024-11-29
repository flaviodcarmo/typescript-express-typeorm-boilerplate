import { Request, Response, Router } from 'express';
import ProfileController from "../controllers/ProfileController";
import { auth } from '../../middleware/Auth';

const router : Router = Router();

router.get('/api/1/profiles', auth.requireAdministrator, async (req: Request, res: Response) => {
    return await new ProfileController(req, res).getByParameters();
});

router.get('/api/1/profiles/:id', auth.requireAdministrator, async (req: Request, res: Response) => {
    return await new ProfileController(req, res).getById();
});

router.post('/api/1/profiles', auth.requireAdministrator, async (req: Request, res: Response) => {
    return await new ProfileController(req, res).insert();
});

router.put('/api/1/profiles/:id', auth.requireAdministrator, async (req: Request, res: Response) => {
    return await new ProfileController(req, res).update();
});

router.delete('/api/1/profiles/:id', auth.requireAdministrator, async (req: Request, res: Response) => {
    return await new ProfileController(req, res).delete();
});

export default router;