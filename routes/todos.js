const express = require("express");
const router = express.Router();
const fs = require("fs");
let writeStream = fs.createWriteStream("public/todos.txt");

/**
 * @swagger
 * /api/todos:
 *   get:
 *     summary: Récupère toutes les tâches (todos)
 *     description: Retourne la liste des tâches.
 *     responses:
 *       200:
 *         description: Liste des tâches
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
 */
router.get("/todos", (req, res) => {
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
 *     summary: Ajoute une nouvelle tâche
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               prenom:
 *                 type: string
 *               todo:
 *                 type: string
 *     responses:
 *       200:
 *         description: Tâche ajoutée
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 prenom:
 *                   type: string
 *                 todo:
 *                   type: string
 *                 date:
 *                   type: string
 *                   format: date-time
 */
router.post("/todos", (req, res) => {
  let prenom = req.body.prenom;
  let todo = req.body.todo;
  let date = new Date();

  // Supposons que writeStream soit défini ailleurs pour écrire dans un fichier
  writeStream.write(JSON.stringify({ prenom, todo, date }) + "\n");

  res.json({ prenom, todo, date });
});

module.exports = router;
