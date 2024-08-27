import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [time, setTime] = useState('');

  useEffect(() => {
    fetch('/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: '{ todos { id title description time } }',
      }),
    })
      .then((response) => response.json())
      .then((data) => setTodos(data.data.todos));
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    fetch('/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          mutation {
            createTodo(title: "${title}", description: "${description}", time: "${time}") {
              id
              title
              description
              time
            }
          }
        `,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setTodos([...todos, data.data.createTodo]);
        setTitle('');
        setDescription('');
        setTime('');
      });
  };

  return (
    <div>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <h2>{todo.title}</h2>
            <p>{todo.description}</p>
            <p>{todo.time}</p>
          </li>
        ))}
      </ul>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Title"
        />
        <input
          type="text"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Description"
        />
        <input
          type="text"
          value={time}
          onChange={(event) => setTime(event.target.value)}
          placeholder="Time"
        />
        <button type="submit">Add Todo</button>
      </form>
    </div>
  );
}

ReactDOM.render(<TodoApp />, document.getElementById('root'));
