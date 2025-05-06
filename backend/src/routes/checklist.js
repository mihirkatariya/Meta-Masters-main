import { Router } from 'express';
const router = Router();
import auth from '../middleware/auth.js';
import {addChecklistItem ,deleteChecklistItem , updateChecklistItem ,checkPermission , getChecklist} from "../controller/event.js"


router.get('/:id', auth, checkPermission(['owner', 'admin', 'member']), getChecklist);
router.post('/:id/categories', auth, checkPermission(['owner', 'admin', 'member']), addChecklistItem);
router.put('/:id/items/:itemId', auth, checkPermission(['owner', 'admin', 'member']), updateChecklistItem);
router.delete('/:id/items/:itemId', auth, checkPermission(['owner', 'admin']), deleteChecklistItem);


export default router;