import { Router } from "express";
import NoteController from "../controllers/note.controller.js";

const router = Router();
const noteController = new NoteController();

//definir las rutas para las notas
router.post("/notes", noteController.createNote);
router.get("/notes", noteController.getNotesByUserId);

//Rutas creadas para las tareas
router.get("/notes/:id", noteController.getNoteById);

router.put("/notes/:id", noteController.updateNote);

router.delete("/notes/:id", noteController.deleteNote);

export default router;
