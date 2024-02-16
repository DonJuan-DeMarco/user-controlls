import express from 'express';
import userController from '../controllers/user-controller';

const router = express.Router();

router.get('/all', userController.all);
router.delete('/delete-self', userController.deleteSelf);

const userRoutes = router;

export default userRoutes;
