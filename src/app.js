const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

/**
 * ValidadeProjectId - Middleware interceptador de requisicoes
 * 
 * Validando o ID para que seja sempre um ID valido
 */

function validadeProjectId(request, response, next){
  const { id } = request.params;

  if (! isUuid(id)){
      return response.status(400).json({ error: 'Invalid project ID'});
  }

  return next();
}

app.use('/repositories/:id', validadeProjectId) // Chamando Middleware somente para rotas que tenha o "/projects/:id"

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});
  
app.post("/repositories", (request, response) => {
  
  const { title, url, techs } = request.body;
  
  const repositorie = { id: uuid(), title, url, techs, likes: 0 };

  repositories.push(repositorie);

  return response.json(repositorie);
});

/**
 * Desafio Pessoal
 * 
 * Atualizar todo paramentro individualmente !! 
 *  Caso o usuario queira somente atualizar uma das informacoes { title, url, techs } 
*/

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params
  const { title, url, techs} = request.body;

  const repositorieIndex = repositories.findIndex(repositorie => repositorie.id === id );

  if ( repositorieIndex < 0 ){
    return response.status(400).json({ error: "Repositorie not found" });
  }

  const repositorie = {
    id,
    title,
    url,
    techs,
    likes: repositories[repositorieIndex].likes,
  }

  repositories[repositorieIndex] = repositorie;

  return response.json(repositorie);

});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
  
  const repositorieIndex = repositories.findIndex( repositorie => repositorie.id === id );

  if ( repositorieIndex < 0 ){
    return response.status(400).json({ error:" Repositorie not Found "})
  }
  repositories.splice(repositorieIndex,1);

  return response.status(204).send(); // Melhorar cod. para enviar uma mensagem informando o ID que foi Deletado 
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositorieIndex = repositories.findIndex( repositorie => repositorie.id === id );

  if ( repositorieIndex < 0 ){
    return response.status(400).json({ error: " Repositorie not found "});
  };
  
  repositories[repositorieIndex].likes += 1;

  return response.status(200).json(repositories[repositorieIndex])
  }); 

module.exports = app;
