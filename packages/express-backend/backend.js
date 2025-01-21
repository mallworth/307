import express from "express";
import cors from "cors";
import * as crypto from "node:crypto";

const app = express();
const port = 8000;

const users = {
    users_list: [
      {
        id: "xyz789",
        name: "Charlie",
        job: "Janitor"
      },
      {
        id: "abc123",
        name: "Mac",
        job: "Bouncer"
      },
      {
        id: "ppp222",
        name: "Mac",
        job: "Professor"
      },
      {
        id: "yat999",
        name: "Dee",
        job: "Aspring actress"
      },
      {
        id: "zap555",
        name: "Dennis",
        job: "Bartender"
      }
    ]
  };

app.use(cors());
app.use(express.json());

const findUserByName = (name) => {
    return users["users_list"].filter(
        (user) => user["name"] === name
    );
};

const findUserByNameJob = (name, job) => {
    return users["users_list"].filter((user) => (user["name"] === name && user["job"] === job));
}

app.get("/users", (req, res) => {
    const name = req.query.name;
    const job = req.query.job;

    if (name != undefined && job != undefined) {
        let result = findUserByNameJob(name, job);
        result = { users_list: result };
        res.send(result);
    } else if (name != undefined) {
        let result = findUserByName(name);
        result = { users_list: result };
        res.send(result);
    } else {
        res.send(users);
    }
});

const findUserById = (id) => users["users_list"].find((user) => user["id"] === id);

app.get("/users/:id", (req, res) => {
    const id = req.params["id"];
    let result = findUserById(id);
    if (result === undefined) {
        res.status(404).send("Resource not found.");
    } else {
        res.send(result);
    }
});

function IDGenerator() {
    let id = crypto.randomBytes(3).toString("hex");
    while (users["users_list"].some((user) => user.id === id)) {
        id = crypto.randomBytes(3).toString("hex");
    }

    return id;
}

const addUser = (user) => {
    user.id = IDGenerator();
    users["users_list"].push(user);
    return user;
}

app.post("/users", (req, res) => {
    const userToAdd = req.body;
    const user = addUser(userToAdd);
    res.status(201).send(user);
});

const removeUser = (id) => {
    users["users_list"] = users["users_list"].filter((user) => user["id"] !== id);
    return users["users_list"];
}

app.delete("/users/:id", (req, res) => {
    const id = req.params["id"];
    let result = removeUser(id);

    if (result === undefined) {
        res.status(404).send("Resource not found.");
    } else {
        res.status(204).send(`Deleted user with id: ${id}`);
    }
});

app.listen(port, () => {
  console.log(
    `Example app listening at http://localhost:${port}`
  );
});