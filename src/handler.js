const { nanoid } = require('nanoid');
const notes = require('./notes');

const addNoteHandler = (req, h) => {
  const { title, tags, body } = req.payload;

  const id = nanoid(16);
  const createdAt = Date();
  const updateAt = createdAt;

  const newNote = {
    title,
    tags,
    body,
    id,
    createdAt,
    updateAt,
  };

  notes.push(newNote);

  const isSucces = notes.filter((note) => note.id === id).length > 0;

  if (isSucces) {
    const res = h.response({
      status: 'succes',
      message: 'Catatan berhasil ditambahkan',
      data: {
        noteId: id,
      },
    });
    res.code(201);
    return res;
  }

  const res = h.response({
    status: 'fail',
    message: 'Catatan gagal ditambahkan',
  });
  res.code(500);
  return res;
};

const getAllHandler = () => ({
  status: 'succes',
  data: {
    notes,
  },
});

const getNoteByIdHandler = (req, h) => {
  const { id } = req.params;
  const note = notes.filter((n) => n.id === id)[0];

  if (note !== undefined) {
    return {
      status: 'succes',
      data: {
        note,
      },
    };
  }
  const res = h.response({
    status: 'fail',
    message: 'Catatan tidak ditemukan',
  });
  res.code(404);
  return res;
};

const editNoteByIdHanlder = (req, h) => {
  const { id } = req.params;

  const { title, tags, body } = req.payload;
  const updateAt = new Date().toISOString();

  const index = notes.findIndex((note) => note.id === id);

  if (index !== -1) {
    notes[index] = {
      ...notes[index],
      title,
      tags,
      body,
      updateAt,
    };

    const res = h.response({
      status: 'succes',
      message: 'Catatan berhasil diperbarui',
    });
    res.code(200);
    return res;
  }

  const res = h.response({
    status: 'fail',
    message: 'Gagal memperbarui catatan. Id tidak ditemukan',
  });
  res.code(404);
  return res;
};

const deleteNoteByIdHandler = (req, h) => {
  const { id } = req.params;

  const index = notes.findIndex((note) => note.id === id);

  if (index !== -1) {
    notes.splice(index, 1);
    const res = h.response({
      status: 'succes',
      message: 'Catatan berhasil dihapus',
    });
    res.code(200);
    return res;
  }

  const res = h.response({
    status: 'fail',
    message: 'Catatan gagal dihapus. Id tidak ditemukan',
  });
  res.code(404);
  return res;
};

module.exports = {
  addNoteHandler,
  getAllHandler,
  getNoteByIdHandler,
  editNoteByIdHanlder,
  deleteNoteByIdHandler,
};
