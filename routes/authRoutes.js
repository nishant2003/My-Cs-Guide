import express from 'express'
import { registerController, loginController, testController, forgotPasswordController } from '../controllers/authController.js'
import { requireSignIn, isAdmin } from '../middlewares/authMiddleware.js';

//router
const router = express.Router();


//routing
//Register || Method Post
router.post("/register", registerController)

//login
router.post("/login", loginController)


//forgot Pass 
router.post("/forgot-password", forgotPasswordController)

//test routes
router.get("/test", requireSignIn, isAdmin, testController)


//protected-user-route-auth
router.get('/user-auth', requireSignIn, (req, res) => {
    res.status(200).send({ ok: true });
});

//protected-admin-route-auth
router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
    res.status(200).send({ ok: true });
});
export default router;