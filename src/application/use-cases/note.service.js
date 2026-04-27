import NoteEntity from "../../domain/entities/note.entity.js";

export default class NoteService {
  constructor(noteRepository) {
    this.noteRepository = noteRepository;
    this.mailService = mailService;
  }

  async createNote(data) {
    if (!data.title || !data.content) {
      throw new Error("Title and content are required");
    }

    const note = new NoteEntity(data);
    return await this.noteRepository.save(note);
  }

  async getNotesByUserId(userId) {
    return await this.noteRepository.findByUserId(userId);
  }

  async updateNote(id, data, currentUserId) {
    const note = await this.noteRepository.findById(id);
    if (!note) throw new Error("Note not found");

    //MODIFICADO PARA LA VERIFICACION CON JWT tarea
    if (note.userId !== currentUserId) {
      throw new Error("Unauthorized: You can only update your own notes");
    }

    return await this.noteRepository.update(id, data);
  }

  async deleteNote(id, currentUserId) {
    const note = await this.noteRepository.findById(id);
    if (!note) throw new Error("Note not found");

    //MOificado para que solo el creador elimite su nota
    if (note.userId !== currentUserId) {
      throw new Error("Unauthorized: You can only delete your own notes");
    }

    const deleted = await this.noteRepository.delete(id);
    if (!deleted) throw new Error("Note could not be deleted");

    return { message: "Note deleted successfully" };
  }

  //PARA EL getNotesById

  async getNoteById(id) {
    const note = await this.noteRepository.findById(id);
    if (!note) {
      throw new Error("Note not found");
    }
    return note;
  }

  async shareNoteByEmail(noteId, targetEmail, currentUserId) {
    const note = await this.noteRepository.findById(noteId);
    if (!note) throw new Error("Note not found");

    // RESTRICCIÓN: Solo el dueño puede compartirla
    if (note.userId !== currentUserId) {
      throw new Error("Unauthorized: You can only share your own notes");
    }

    return await this.mailService.sendNoteEmail(targetEmail, note);
  }
}
