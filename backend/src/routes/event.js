import { Router } from 'express';
const router = Router();
import auth from '../middleware/auth.js';
import { createEvent, getEvents, updateEvent, deleteEvent, checkPermission ,inviteMember , changeMemberRole , getEvent} from '../controller/event.js';
import { exportEventPDF } from '../controller/exportPDF.js';

router.get('/:id', auth, getEvent);
// List all events user is part of
router.get('/', auth, getEvents);

// Create event (owner only)
router.post('/', auth, createEvent);

//for adding permissions
router.post('/:id/invite', auth, checkPermission(['owner', 'admin']), inviteMember);
router.put('/:id/role', auth, checkPermission(['owner']), changeMemberRole);

// Update (only owner/admin)
router.put('/:id', auth, checkPermission(['owner', 'admin']), updateEvent);

// Delete (only owner)
router.delete('/:id', auth, checkPermission(['owner']), deleteEvent);

router.get('/:id/export/pdf', auth, checkPermission(['owner', 'admin', 'member']), exportEventPDF);

export default router;
