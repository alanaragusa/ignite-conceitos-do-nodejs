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
    return response.status(404).json({error:"User not found"})
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
    return response.status(400).json({error: "User already exists."});
  };
  
  const user = {
    id: uuidv4(),
    name,
    username,
    todos: []
  };

  // push para o array users acima //
  users.push(user);

  return response.status(201).send(user);
});

// lista com todas as tarefas do usuário //
app.get('/todos', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  
  return response.json(user.todos);
});

// adicionar uma nova tarefa //
app.post('/todos', checksExistsUserAccount, (request, response) => {
  const { title, deadline } = request.body;
  const { user } = request;

  const todo = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()
  }
  user.todos.push(todo);

  return response.status(201).json(todo);
});

// atualizar tarefa //
app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // rota recebe pelo corpo da requisição o title e deadline //
  const { title, deadline } = request.body;
  const { user } = request;

  // alterar apenas o title e deadline da tarefa que possua o id igual ao id presente nos parâmetros da rota //
  const { id } = request.params;

  const updateToDo = user.todos.find(todo => todo.id === id);

  if(!updateToDo) {
    return response.status(404).json({error:"Todo not found"});
  }

  updateToDo.title = title;
  updateToDo.deadline = new Date(deadline);

  return response.status(201).json(updateToDo);
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { id } = request.params;

  const statusToDoChange = user.todos.find(todo => todo.id === id);
  if (!statusToDoChange) {
    return response.status(404).json({error:"Todo not found"});
  }
  statusToDoChange.done = true;

  return response.json(statusToDoChange);
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { id } = request.params;

  const deleteToDo = user.todos.findIndex(todo => todo.id === id);

  // -1 indica que o todo não foi encontrado no array //
  if(deleteToDo === -1) {
    return response.status(404).json({error:"Todo not found"});
  }
  user.todos.splice(deleteToDo, 1);
  
  return response.status(204).json();
});

module.exports = app;