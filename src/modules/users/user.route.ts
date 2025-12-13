import { Router } from "express"
import { userController } from "./user.controller";
// import auth from "../../middleware/auth";
import { Roles } from "../auth/auth.constant";


const router = Router();



// router.get('/' ,auth(Roles.admin), userController.getAllUser)
// router.get('/singleUser',auth(Roles.user), userController.getSingleUser)

export const userRoute = router ;