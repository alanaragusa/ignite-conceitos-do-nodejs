const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

// array para armazenamento provisório dos users //
const users = [];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
}

app.post('/users', (request, response) => {
  const { name, username } = request.body;
  const id = uuidv4();

  users.push({
    id,
    name,
    username,
    todos: []
  });

  return response.status(201).send();
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;