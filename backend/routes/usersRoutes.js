import express from "express";
import { getUsers } from "../contollers/usersController.js";

const router = express.Router();

router.get("/", getUsers);

export default router;
