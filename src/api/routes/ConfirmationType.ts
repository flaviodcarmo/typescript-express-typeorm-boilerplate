import { Request, Response, Router } from 'express';
import ConfirmationTypeController from "../controllers/ConfirmationTypeController";
import { auth } from '../../middleware/Auth_v2';

const router = Router();

router.get('/api/1/confirmation-types', auth.requireAdministrator, async (req: Request, res: Response) => {
    return await new ConfirmationTypeController(req, res).getByParameters();
});

router.get('/api/1/confirmation-types/:id', auth.requireAdministrator, async (req: Request, res: Response) => {
    return await new ConfirmationTypeController(req, res).getById();
});

router.post('/api/1/confirmation-types', auth.requireAdministrator, async (req: Request, res: Response) => {
    return await new ConfirmationTypeController(req, res).insert();
});

router.put('/api/1/confirmation-types/:id', auth.requireAdministrator, async (req: Request, res: Response) => {
    return await new ConfirmationTypeController(req, res).update();
});

router.delete('/api/1/confirmation-types/:id', auth.requireAdministrator, async (req: Request, res: Response) => {
    return await new ConfirmationTypeController(req, res).delete();
});

export default router;