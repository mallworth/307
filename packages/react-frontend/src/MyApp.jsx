import React, { useState, useEffect } from "react";
import Table from "./Table";
import Form from "./Form";


export default function MyApp() {
    const [characters, setCharacters] = useState([]);

    function fetchUsers() {
      const promise = fetch("http://localhost:8000/users");
      return promise;
    }

    function deleteUser(id) {
      const promise = fetch(`http://localhost:8000/users/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(response => {
          if (response.status === 404) {
            throw new Error("Resource not found");
          }}
        );
      
      return promise;
    }

    function postUser(person) {
      const promise = fetch("http://localhost:8000/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(person)
      })

      return promise;
    }

    function updateList(person) {
      postUser(person)
      .then((res) => {
        if (res.status === 201) {
          return res.json();
        } else {
          throw new Error ("User insertion error.");
        }})
      .then((user) => {
        setCharacters([...characters, user]);
        })
      .catch((error) => {
        console.log(error);
      });
    }

    function removeOneCharacter(index) {
      const id = characters[index]._id;
      deleteUser(id)
        .then(() => {
          const updated = characters.filter((character, i) => {
            return i !== index;
          });
          setCharacters(updated);
        })
        .catch((error) => {
          console.log(error);
        })
    }

    useEffect(() => {
      fetchUsers()
        .then((res) => res.json())
        .then((json) => setCharacters(json["users_list"]))
        .catch((error) => {
          console.log(error);
        });
    }, []);

    return (
      <div className="container">
        <Table 
            characterData={characters}
            removeCharacter={removeOneCharacter}
         />
         <Form handleSubmit={updateList}/>
      </div>
    );
  }