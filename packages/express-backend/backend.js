import express from "express";
import cors from "cors";
import * as crypto from "node:crypto";
import dotenv from "dotenv";
import mongoose from "mongoose";
import services from "./services/user-service.js";

dotenv.config();

const { MONGO_CONNECTION_STRING } = process.env;

mongoose.set("debug", true);
mongoose
  .connect(MONGO_CONNECTION_STRING + "users") // connect to Db "users"
  .catch((error) => console.log(error));

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

app.get("/users", (req, res) => {
    const name = req.query.name;
    const job = req.query.job;

    services
      .getUsers(name, job)
      .then((result) => {
        res.send({ users_list: result })
      });
});

app.get("/users/:id", (req, res) => {
    const id = req.params["id"];
    services
    .findUserById(id)
    .then((result) => res.send(result));
});

app.post("/users", (req, res) => {
    const userToAdd = req.body;
    services
    .addUser(userToAdd)
    .then((result) => res.status(201).send(userToAdd));
});

app.delete("/users/:id", (req, res) => {
    const id = req.params["id"];
    services
    .removeUser(id)
    .then((result) => res.status(204).send(`Deleted user with id: ${id}`));
});

app.listen(port, () => {
  console.log(
    `Example app listening at http://localhost:${port}`
  );
});