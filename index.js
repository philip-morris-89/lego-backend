import express from "express";
import { PrismaClient } from "@prisma/client";
import middlewareValidator from "./src/middleware/validator/validator.js";
import schema from "./src/middleware/validator/schema.js";
import cors from "cors";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();
const app = express();

app.use(express.json());
app.use(cors());

app.post("/signup", schema, middlewareValidator, async (req, res) => {
  try {
    res.status(200);
    res.header("Content-Type", "application/json");
    const { email, password } = req.body;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await prisma.users.create({
      data: {
        email: email,
        password: hashedPassword,
      },
    });

    res.send(JSON.stringify({ message: "Utente creato" }));
  } catch (error) {
    if (error.toString().includes("Unique")) {
      res.status(500).json({ message: "Utente già registrato" });
      return;
    }
    res.status(500).json({ message: `Utente non creato: ${error}` });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.users.findUnique({ where: { email } });

  if (!user) return res.status(401).json({ error: "Nessun utente trovato" });

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return res.status(401).json({ error: "Password non valida" });

  res.json({ message: "Login effettuato con successo", user });
});

app.listen(3001, () => {
  console.log("Running on port", 3001);
});
