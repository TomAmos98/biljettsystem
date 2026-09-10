const express = require("express");
const cors = require("cors");
const db = require("./database");

const app = express();
const PORT = 5000;

// Skapar en slumpmässig biljettkod
function generateTicketCode() {
  return Math.random()
    .toString(36)
    .substring(2, 10)
    .toUpperCase();
}

// CORS - tillåter frontend att kommunicera med backend
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());

// Testa att servern fungerar
app.get("/", (req, res) => {
  res.send("Biljettsystem backend fungerar!");
});

// Hämta alla biljetter
app.get("/api/tickets", (req, res) => {
  const tickets = db.prepare("SELECT * FROM tickets").all();
  res.json(tickets);
});

// Skapa en ny biljett
app.post("/api/tickets", (req, res) => {
  const code = generateTicketCode();

  const result = db
    .prepare("INSERT INTO tickets (code) VALUES (?)")
    .run(code);

  const ticket = db
    .prepare("SELECT * FROM tickets WHERE id = ?")
    .get(result.lastInsertRowid);

  res.status(201).json(ticket);
});

// Använd en biljett
app.post("/api/tickets/use", (req, res) => {
  const { code } = req.body;

  if (!code || !code.trim()) {
    return res.status(400).json({
      message: "Biljettkod saknas",
    });
  }

  const ticket = db
    .prepare("SELECT * FROM tickets WHERE code = ?")
    .get(code);

  if (!ticket) {
    return res.status(404).json({
      message: "Biljetten finns inte",
    });
  }

  if (ticket.used === 1) {
    return res.status(400).json({
      message: "Biljetten är redan använd",
    });
  }

  db.prepare(
    "UPDATE tickets SET used = 1 WHERE code = ?"
  ).run(code);

  res.json({
    message: "Biljetten har använts",
    code: code,
  });
});

// Radera en biljett
app.delete("/api/tickets/:code", (req, res) => {
  const { code } = req.params;

  const ticket = db
    .prepare("SELECT * FROM tickets WHERE code = ?")
    .get(code);

  if (!ticket) {
    return res.status(404).json({
      message: "Biljetten finns inte",
    });
  }

  if (ticket.used === 1) {
    return res.status(400).json({
      message: "En använd biljett får inte raderas",
    });
  }

  db.prepare(
    "DELETE FROM tickets WHERE code = ?"
  ).run(code);

  res.json({
    message: "Biljetten har raderats",
    code: code,
  });
});

// Starta servern
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Servern kör på http://localhost:${PORT}`);
  });
}

module.exports = app;