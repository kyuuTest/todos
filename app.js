const { name } = require('ejs');
const express = require('express');
const cors = require('cors')
const app = express();
const port = 3000;

app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const todoList = new Array();

let fs = require('fs');
let writeStream = fs.createWriteStream('public/todos.txt');

// Routes pour l'application sans passer par une API

// Route de base
app.get('/', (req, res) => {
    // Lire le fichier todos.txt et créer un tableau de todos
    let todoList = new Array();
    let data = fs.readFileSync('public/todos.txt','utf8');
    let lines = data.split('\n');
    lines.forEach((line)=>{
        if(line.length > 0){
            let todo = JSON.parse(line);
            todoList.push(todo);
        }
    });

    res.render('todo',{todos:todoList});
});

// Route pour ajouter un todo
app.post('/addTodo',(req,res)=>{
    let prenom = req.body.prenom;
    let todo = req.body.todo;
    let date = new Date();

    writeStream.write(JSON.stringify({prenom:prenom,todo:todo, date:date})+'\n');
    res.redirect('/');
})

app.post('/deleteAllTodos',(req,res)=>{
    fs.writeFile('public/todos.txt','',()=>{});
    res.redirect('/');
})

// Route pour supprimer un todo
app.post('/deleteTodo',(req,res)=>{
    let todo = req.body.todo;
    let index = todoList.findIndex((element)=>element.todo === todo);
    todoList.splice(index,1);
    res.redirect('/');
});

app.get('/api/todos',(req,res)=>{
    let todoList = new Array();
    let data = fs.readFileSync('public/todos.txt','utf8');
    let lines = data.split('\n');
    lines.forEach((line)=>{
        if(line.length > 0){
            let todo = JSON.parse(line);
            todoList.push(todo);
        }
    });
    res.json(todoList);
});


// Ecoute sur le port 3000 pour l'affichage dans la console
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
