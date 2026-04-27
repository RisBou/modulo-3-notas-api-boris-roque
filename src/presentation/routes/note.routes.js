import { Router } from "express";
import NoteController from "../controllers/note.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();
const noteController = new NoteController();

//definir las rutas para las notas
router.post("/notes", noteController.createNote);
router.get("/notes", noteController.getNotesByUserId);

//Rutas creadas para las tareas
router.get("/notes/:id", noteController.getNoteById);

router.put("/notes/:id", authMiddleware, noteController.updateNote);

router.delete("/notes/:id", authMiddleware, noteController.deleteNote);

export default router;
