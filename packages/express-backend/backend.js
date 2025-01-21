import express from "express";

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

app.use(express.json());

const findUserByName = (name) => {
    return users["users_list"].filter(
        (user) => user["name"] === name
    );
};

app.get("/users", (req, res) => {
    const name = req.query.name;
    if (name != undefined) {
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

const addUser = (user) => {
    users["users_list"].push(user);
    return user;
}

app.post("/users", (req, res) => {
    const userToAdd = req.body;
    addUser(userToAdd);
    res.send();
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
        res.status(200).send("OK");
    }
});

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
    } else {
        res.send(users);
    }
});

app.listen(port, () => {
  console.log(
    `Example app listening at http://localhost:${port}`
  );
});