import { useState, useEffect } from 'react';

function App() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState('');
  const [filter, setFilter] = useState('hepsi');

  useEffect(() => {
    fetch('http://3.88.86.108:5000/todos')
      .then(res => res.json())
      .then(data => setTodos(data));
  }, []);

  const addTodo = () => {
    if (!text.trim()) return;
    fetch('http://3.88.86.108:5000/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    })
      .then(res => res.json())
      .then(todo => { setTodos([...todos, todo]); setText(''); });
  };

  const deleteTodo = (id) => {
    fetch(`http://3.88.86.108:5000/todos/${id}`, { method: 'DELETE' })
      .then(() => setTodos(todos.filter(t => t.id !== id)));
  };

  const toggleTodo = (id) => {
    fetch(`http://3.88.86.108:5000/todos/${id}`, { method: 'PUT' })
      .then(res => res.json())
      .then(updated => setTodos(todos.map(t => t.id === id ? updated : t)));
  };

  const filtered = todos.filter(t => {
    if (filter === 'aktif') return !t.done;
    if (filter === 'tamamlanan') return t.done;
    return true;
  });

  const tamamlanan = todos.filter(t => t.done).length;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #ea6666 0%, #3cbb40 100%)',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
      padding: '20px 20px',
      fontFamily: "'Segoe UI', sans-serif"
    }}>
      <div style={{
        background: 'lightgray',
        borderRadius: '15px',
        padding: '30px',
        width: '100%',
        maxWidth: '550px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
      }}>
        <h1 style={{ margin: '0 0 5px 0', color: '#00157e', fontSize: '28px' }}>📝 Todo Listesi</h1>
        <p style={{ margin: '0 0 25px 0', color: '#00157e', fontSize: '18px' }}>
          {tamamlanan}/{todos.length} Görev Tamamlandı
        </p>

        <div style={{ background: '#eee', borderRadius: '10px', height: '8px', marginBottom: '25px' }}>
          <div style={{
            background: 'linear-gradient(90deg, #f17800, #fd1201)',
            height: '8px',
            borderRadius: '4px',
            width: todos.length ? `${(tamamlanan / todos.length) * 100}%` : '0%',
            transition: 'width 0.3s ease'
          }} />
        </div>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <input
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addTodo()}
            placeholder="Yeni görev ekle..."
            style={{
              flex: 1, padding: '12px 16px', fontSize: '15px',
              border: '2px solid #000000', borderRadius: '12px', outline: 'none'
            }}
          />
          <button onClick={addTodo} style={{
            padding: '12px 20px', fontSize: '15px', fontWeight: 'bold',
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer'
          }}>
            + Ekle
          </button>
        </div>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
          {['hepsi', 'aktif', 'tamamlanan'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: '6px 16px', borderRadius: '20px', border: 'none', cursor: 'pointer',
              background: filter === f ? 'linear-gradient(135deg, #66ea75, #a02604)' : '#5ff544',
              color: filter === f ? 'black' : '#000000',
              fontWeight: filter === f ? 'bold' : 'normal',
            }}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {filtered.length === 0 && (
          <p style={{ textAlign: 'center', color: '#000000', padding: '20px' }}>Tüm Görevler Tamamlanmış 🎉</p>
        )}
        {filtered.map(todo => (
          <div key={todo.id} style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            padding: '14px 16px', marginBottom: '10px',
            background: todo.done ? '#f9f9f9' : 'white',
            border: '2px solid', borderColor: todo.done ? '#000000' : '#000000',
            borderRadius: '14px', transition: 'all 0.2s'
          }}>
            <div onClick={() => toggleTodo(todo.id)} style={{
              width: '22px', height: '22px', borderRadius: '50%', cursor: 'pointer',
              border: '2px solid', borderColor: todo.done ? '#000000' : '#000000',
              background: todo.done ? 'linear-gradient(135deg, #848600, #490191)' : 'white',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0
            }}>
              {todo.done && <span style={{ color: 'white', fontSize: '12px' }}>✓</span>}
            </div>
            <span style={{
              flex: 1, fontSize: '15px',
              textDecoration: todo.done ? 'line-through' : 'none',
              color: todo.done ? '#000000' : '#000000'
            }}>
              {todo.text}
            </span>
            <button onClick={() => deleteTodo(todo.id)} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: '18px', color: '#ddd', padding: '0'
            }}>🗑️</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;