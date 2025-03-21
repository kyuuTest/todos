const { name } = require("ejs");
const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const todoList = new Array();

let fs = require("fs");
let writeStream = fs.createWriteStream("public/todos.txt");

// Options + routes pour l'API
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Documentation",
      version: "1.0.0",
      description: "Documentation de l'API",
    },
  },
  apis: ["./app.js"], // Ajuste selon tes fichiers
};

const specs = swaggerJsdoc(options);
app.use("/api", swaggerUi.serve, swaggerUi.setup(specs));

// Routes pour l'application sans passer par une API

// Route de base
app.get("/", (req, res) => {
  // Lire le fichier todos.txt et créer un tableau de todos
  let todoList = new Array();
  let data = fs.readFileSync("public/todos.txt", "utf8");
  let lines = data.split("\n");
  lines.forEach((line) => {
    if (line.length > 0) {
      let todo = JSON.parse(line);
      todoList.push(todo);
    }
  });

  res.render("todo", { todos: todoList });
});

// Route pour ajouter un todo
app.post("/addTodo", (req, res) => {
  let prenom = req.body.prenom;
  let todo = req.body.todo;
  let date = new Date();

  writeStream.write(
    JSON.stringify({ prenom: prenom, todo: todo, date: date }) + "\n"
  );
  res.redirect("/");
});

app.post("/deleteAllTodos", (req, res) => {
  fs.writeFile("public/todos.txt", "", () => {});
  res.redirect("/");
});

// Route pour supprimer un todo
app.post("/deleteTodo", (req, res) => {
  let todo = req.body.todo;
  let index = todoList.findIndex((element) => element.todo === todo);
  todoList.splice(index, 1);
  res.redirect("/");
});

/**
 * @swagger
 * /api/todos:
 *   get:
 *     summary: Récupère toutes les tâches (todos)
 *     description: Utilisé pour récupérer la liste de toutes les tâches à faire.
 *     responses:
 *       200:
 *         description: Une réponse réussie
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   prenom:
 *                     type: string
 *                   todo:
 *                     type: string
 *                   date:
 *                     type: string
 *                     format: date
 *       400:
 *         description: Requête invalide
 */
app.get("/api/todos", (req, res) => {
  let todoList = new Array();
  let data = fs.readFileSync("public/todos.txt", "utf8");
  let lines = data.split("\n");
  lines.forEach((line) => {
    if (line.length > 0) {
      let todo = JSON.parse(line);
      todoList.push(todo);
    }
  });
  res.json(todoList);
});

/**
 * @swagger
 * /api/todos:
 *   post:
 *     summary: Ajoute une nouvelle tâche (todo)
 *     description: Permet d'ajouter une nouvelle tâche avec un prénom et un texte.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               prenom:
 *                 type: string
 *                 description: Le prénom de la personne assignée à la tâche
 *                 example: "Alice"
 *               todo:
 *                 type: string
 *                 description: La description de la tâche à faire
 *                 example: "Acheter du lait"
 *     responses:
 *       200:
 *         description: Tâche ajoutée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 prenom:
 *                   type: string
 *                   example: "Alice"
 *                 todo:
 *                   type: string
 *                   example: "Acheter du lait"
 *                 date:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-03-21T14:30:00Z"
 *       400:
 *         description: Mauvaise requête (ex. données manquantes)
 */
app.post("/api/todos", (req, res) => {
  let prenom = req.body.prenom;
  let todo = req.body.todo;
  let date = new Date();

  writeStream.write(
    JSON.stringify({ prenom: prenom, todo: todo, date: date }) + "\n"
  );
  res.json({ prenom: prenom, todo: todo, date: date });
});

// Ecoute sur le port 3000 pour l'affichage dans la console
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
