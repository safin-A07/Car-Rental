import { Router } from "express";
import { vehicleController } from "./vehicles.controller";
import { adminOnly, auth } from "../../middleware/auth";

const router = Router();

router.post('/' ,auth ,adminOnly, vehicleController.createVehicle)//admin but not working

router.get('/' , vehicleController.getAllVehicle )
router.get("/:vehicleId", vehicleController.getVehicleById);
router.put("/:vehicleId", vehicleController.updateVehicle);//admin but not working
router.delete("/:vehicleId", vehicleController.deleteVehicle);

export const vehicleRoute = router ;