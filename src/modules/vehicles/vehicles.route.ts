import { Router } from "express";
import { vehicleController } from "./vehicles.controller";
import { adminOnly, auth } from "../../middleware/auth";

const router = Router();

router.post('/'  , vehicleController.createVehicle)

export const vehicleRoute = router ;