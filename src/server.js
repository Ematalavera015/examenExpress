const express = require('express');

const STATUS_USER_ERROR = 422;

// This array of posts persists in memory across requests. Feel free
// to change this to a let binding if you need to reassign it.
let posts = [];

const server = express();
// to enable parsing of json bodies for post requests
server.use(express.json());

function idUnico() {
  // function closure
  let id = 0;
  return function () {
    id = id + 1;
    return id;
  };
}

const newId = idUnico(); // instancio la closure

// TODO: your code to handle requests

server.post('/posts',(req, res) =>{
  const {author, title, contents} = req.body;
  if(author && title && contents){
    const post = {
      id: newId(),
      author,
      title,
      contents,
    }
    posts.push(post);
    return res.json(post);
  }else{
    return res.status(STATUS_USER_ERROR).json({error: "No se recibieron los parámetros necesarios para crear el Post"});
  }
});

server.post('/posts/author/:author', (req, res)=>{
  const {title, contents} = req.body;
  
  if(title && contents && req.params.author){
    const post = {
      id: newId(),
      author: req.params.author,
      title,
      contents,
    }
    posts.push(post);
    return res.json(post);
  }else{
    return res.status(STATUS_USER_ERROR).json({error: "No se recibieron los parámetros necesarios para crear el Post"});
  }
});

server.get('/posts', (req, res) => {
  const filtro = req.query.term;
  if(filtro){
    const postsFilter = posts.filter( post => post.title.includes(filtro) || post.contents.includes(filtro));
    return res.json(postsFilter);
  }else{
    return res.json(posts);
  }
});

server.get('/posts/:author',(req, res) => {
  const author = req.params.author;
  if(author){
    const postsFilter = posts.filter(post => post.author === author);
    if(postsFilter.length > 0){
      return res.json(postsFilter);
    }else{
      return res.status(STATUS_USER_ERROR).json({error: "No existe ningun post del autor indicado"});  
    }
  }else{
    return res.status(STATUS_USER_ERROR).json({error: "No existe ningun post del autor indicado"});
  }
});

server.get('/posts/:author/:title',(req, res) => {
  const author = req.params.author;
  const title = req.params.title;
  if(author){
    const postsFilter = posts.filter(post => post.author === author && post.title === title);
    if(postsFilter.length > 0){
      return res.json(postsFilter);
    }else{
      return res.status(STATUS_USER_ERROR).json({error: "No existe ningun post con dicho titulo y autor indicado"});  
    }
  }else{
    return res.status(STATUS_USER_ERROR).json({error: "No existe ningun post con dicho titulo y autor indicado"});
  }
});

server.put('/posts', (req, res) => {
  const {id,title,contents} = req.body;

  if(id && title && contents){
    const post = posts.find(p => p.id === id);
    if(post){
      post.title = title;
      post.contents = contents;
      res.json(post);
    }else{
      res.status(STATUS_USER_ERROR).json({error: "No existe ningun post con el id indicado"});
    }
  }else{
    res.status(STATUS_USER_ERROR).json({error: "No se recibieron los parámetros necesarios para modificar el Post"});
  }
});

server.delete('/posts', (req, res) => {
  const {id} = req.body;
  if(id){
    const post = posts.find(p => p.id === id);
    if(post){
      posts = posts.filter(p => p.id !== post.id);
      res.json({ success: true });
    }else{
      res.status(STATUS_USER_ERROR).json({error: "Mensaje de error"});  
    }
  }else{
    res.status(STATUS_USER_ERROR).json({error: "Mensaje de error"});
  }
});

server.delete('/author', (req, res) => {
  const {author} = req.body;
  if(author){
    const post = posts.find(p => p.author === author);
    if(post){
      posts = posts.filter(p => p.author === author);
      res.json(posts);
    }else{
      res.status(STATUS_USER_ERROR).json({error: "No existe el autor indicado"});  
    }
  }else{
    res.status(STATUS_USER_ERROR).json({error: "Mensaje de error"});
  }
});

module.exports = { posts, server };
