const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');

const app = express();
app.use(cors());
app.use(express.json());

const db = new Database('todos.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text TEXT NOT NULL,
    done INTEGER DEFAULT 0
  )
`);

app.get('/todos', (req, res) => {
  const todos = db.prepare('SELECT * FROM todos').all();
  res.json(todos.map(t => ({ ...t, done: t.done === 1 })));
});

app.post('/todos', (req, res) => {
  const stmt = db.prepare('INSERT INTO todos (text) VALUES (?)');
  const result = stmt.run(req.body.text);
  res.status(201).json({ id: result.lastInsertRowid, text: req.body.text, done: false });
});

app.delete('/todos/:id', (req, res) => {
  db.prepare('DELETE FROM todos WHERE id = ?').run(req.params.id);
  res.json({ message: 'Silindi' });
});

app.put('/todos/:id', (req, res) => {
  const todo = db.prepare('SELECT * FROM todos WHERE id = ?').get(req.params.id);
  if (todo) {
    const newDone = todo.done === 1 ? 0 : 1;
    db.prepare('UPDATE todos SET done = ? WHERE id = ?').run(newDone, req.params.id);
    res.json({ ...todo, done: newDone === 1 });
  } else {
    res.status(404).json({ error: 'Bulunamadı' });
  }
});

app.listen(5000, () => {
  console.log('Backend çalışıyor: http://localhost:5000');
});