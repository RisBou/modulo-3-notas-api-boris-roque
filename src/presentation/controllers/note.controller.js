export default class NoteController {
  constructor(noteService) {
    this.noteService = noteService;
  }

  createNote = async (req, res) => {
    const data = req.body;

    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        code: 401,
        message: "No autorizado",
      });
    }

    if (req.file) data.imageUrl = "/uploads/" + req.file.filename;
    data.userId = req.user.id;

    try {
      const note = await this.noteService.createNote(data);

      return res.status(201).json({
        success: true,
        code: 201,
        message: "Nota creada correctamente",
        data: note,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        code: 400,
        message: error.message,
      });
    }
  };

  getNotesByUserId = async (req, res) => {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        code: 401,
        message: "No autorizado",
      });
    }

    const userId = req.user.id;

    try {
      const notes = await this.noteService.getNotesByUserId(userId);

      return res.status(200).json({
        success: true,
        code: 200,
        message: "Notas obtenidas correctamente",
        data: notes,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        code: 500,
        message: error.message,
      });
    }
  };

  updateNote = async (req, res) => {
    const { id } = req.params;
    const data = req.body;

    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        code: 401,
        message: "No autorizado",
      });
    }

    const currentUserId = req.user.id;

    if (req.file) data.imageUrl = "/uploads/" + req.file.filename;

    try {
      const note = await this.noteService.updateNote(id, data, currentUserId);

      return res.status(200).json({
        success: true,
        code: 200,
        message: "Nota actualizada correctamente",
        data: note,
      });
    } catch (error) {
      let status = 500;

      if (error.message.includes("Unauthorized")) status = 403;
      else if (error.message.includes("not found")) status = 404;

      return res.status(status).json({
        success: false,
        code: status,
        message: error.message,
      });
    }
  };

  deleteNote = async (req, res) => {
    const { id } = req.params;

    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        code: 401,
        message: "No autorizado",
      });
    }

    const currentUserId = req.user.id;

    try {
      await this.noteService.deleteNote(id, currentUserId);

      return res.status(200).json({
        success: true,
        code: 200,
        message: "Nota eliminada correctamente",
      });
    } catch (error) {
      let status = 500;

      if (error.message.includes("Unauthorized")) status = 403;
      else if (error.message.includes("not found")) status = 404;

      return res.status(status).json({
        success: false,
        code: status,
        message: error.message,
      });
    }
  };

  shareNote = async (req, res) => {
    const { id } = req.params;
    const { email } = req.body;

    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        code: 401,
        message: "No autorizado",
      });
    }

    if (!email) {
      return res.status(400).json({
        success: false,
        code: 400,
        message: "Target email is required",
      });
    }

    const currentUserId = req.user.id;

    try {
      const result = await this.noteService.shareNoteByEmail(
        id,
        email,
        currentUserId,
      );

      return res.status(200).json({
        success: true,
        code: 200,
        message: "Nota compartida correctamente",
        data: result,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        code: 400,
        message: error.message,
      });
    }
  };

  getNoteById = async (req, res) => {
    const { id } = req.params;

    try {
      const note = await this.noteService.getNoteById(id);

      if (!note) {
        return res.status(404).json({
          success: false,
          code: 404,
          message: "Nota no encontrada",
        });
      }

      return res.status(200).json({
        success: true,
        code: 200,
        message: "Nota obtenida correctamente",
        data: note,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        code: 500,
        message: error.message,
      });
    }
  };
}
