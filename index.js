import express from "express";
import { PrismaClient } from "@prisma/client";
import middlewareValidator from "./src/middleware/validator/validator.js";
import schema from "./src/middleware/validator/schema.js";

const prisma = new PrismaClient();
const app = express();
app.use(express.json());

app.post("/signup", schema, middlewareValidator, async (req, res) => {
  try {
    res.status(200);
    res.header("Content-Type", "application/json");
    const newUser = await prisma.users.create({
      data: req.body,
    });
    console.log(newUser);

    res.send(JSON.stringify({ message: "Utente creato" }));
  } catch (error) {
    if (error.toString().includes("Unique")) {
      res.status(500).json({ message: `Utente già registrato: ${error}` });
      return;
    }
    res.status(500).json({ message: `Utente non creato: ${error}` });
  }
});

app.listen(3000, () => {
  console.log("Running on port", 3000);
});
