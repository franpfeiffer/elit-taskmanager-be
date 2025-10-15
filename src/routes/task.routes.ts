import { Router } from 'express';
import { TaskController } from '../controllers/task.controller';

const router = Router();
const taskController = new TaskController();

router.post('/', taskController.create.bind(taskController));
router.get('/', taskController.getAll.bind(taskController));
router.get('/:id', taskController.getById.bind(taskController));
router.patch('/:id', taskController.update.bind(taskController));
router.delete('/:id', taskController.delete.bind(taskController));

export default router;
