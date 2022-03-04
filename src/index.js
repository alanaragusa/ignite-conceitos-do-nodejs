const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

// array para armazenamento provisório dos users //
const users = [];

// middleware //
function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers; 

  // procurar se existe algum usuário com o username já cadastrado //
  const user = users.find(user => user.username === username);

  // verificação da existência do usuário //
  if(!user){
    return response.status(400).json({error:"User not found"})
  }

  request.user = user;

  return next();
}

// cadastrar novo usuário //
app.post('/users', (request, response) => {
  const { name, username } = request.body;

  // checando se o username do novo cadastro já existe //
  const userAlreadyExists = users.some(
    (users) => users.username === username
  );

  if (userAlreadyExists) {
    return response.status(400).json({error: "User already exists."})
  };
  
  // push para enviar a informação para o array acima //
  users.push({
    id: uuidv4(),
    name,
    username,
    todos: []
  });

  return response.status(201).send();
});

// lista com todas as tarefas do usuário //
app.get('/todos', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  
  return response.json(user.todos);
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