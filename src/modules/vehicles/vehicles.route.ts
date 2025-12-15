import { Router } from "express";
import { vehicleController } from "./vehicles.controller";
import auth from "../../middleware/auth";


const router = Router();

router.post('/' ,auth("admin"), vehicleController.createVehicle)//admin but not working

router.get('/' , vehicleController.getAllVehicle )
router.get("/:vehicleId", vehicleController.getVehicleById);
router.put("/:vehicleId", vehicleController.updateVehicle);//admin but not working
router.delete("/:vehicleId", vehicleController.deleteVehicle);

export const vehicleRoute = router ;