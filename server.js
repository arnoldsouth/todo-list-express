// Create a constant variable `express` and assign the imported `express` module to it
const express = require("express");

// Create a constant variable `app` and assign the `express` application to it
const app = express();

// Create a constant variable `MongoClient` and assign the imported `mongodb` module with the class `MongoClient` to it, using the `connect` method that came with the module
const MongoClient = require("mongodb").MongoClient;

// Create a constant variable `PORT` and assign the port number `2121` to it
const PORT = 2121;

// After importing the `dotenv` module, call the `config` method on it to load environment variables within the `.env` file into the `process.env` property
require("dotenv").config();

// Create and declare mutable variables `db`, `dbConnectionStr`, and `dbName`: `db` stores class instance; `dbConnectionStr` stores the connection string using process.env.DB_STRING (DB_STRING stored within .env file); `dbName` stores the name of the database we using
let db,
  dbConnectionStr = process.env.DB_STRING,
  dbName = "todo";

// Call static `connect` method on MongoClient with the object `dbConnectionStr` and its property `useUnifiedTopology` that has a value of `true` in order to use the server and engine
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }).then(
  (client) => {
    // Logs string to the browser's console with `dbName` telling us we've connected to the database successfully
    console.log(`Connected to ${dbName} Database`);
    // Re-assign `db` to `dbName` by using the current MongoClient instance's `db` method
    db = client.db(dbName);
  }
);

// Call `set` method on our Express app's setting properties; `view engine` is the template engine to use, and `ejs` is the template
app.set("view engine", "ejs");

// Call the Express app's `use` method to use middleware `express.static`, which is to serve static content for the app from the `public` directory in the application directory
app.use(express.static("public"));

// Call the Express app's `use` method to use middleware function `express.urlencoded`, which is to parse incoming requests with urlencoded payloads and is based on `body-parser`; aka adds `body-parser` `urlencoded` middleware to the Express app, and parses the content requests `Content-Type` with the type "application/x-www-form-urlencoded"
// From Express docs: Returns middleware that only parses urlencoded bodies and only looks at requests where the Content-Type header matches the type option
app.use(express.urlencoded({ extended: true }));

// Adds `body-parser` `json` middleware to the Express app, and parses the content requests `Content-Type` with the type "application/json"
app.use(express.json());

// Use `get` method to create a custom request handler at the path `/`
app.get("/", async (request, response) => {
  // Create a variable `todoItems`, assigning to it an array of document objects within the connected database's collection; at the database's collection, we use find() with no filter object to obtain all documents, and then we use toArray() to convert document query into an array
  const todoItems = await db.collection("todos").find().toArray();

  // Create a variable `itemsLeft`, assigning to it an array of completed document objects within the connected database's collection; at the database's collection, we use countDocuments() with the property `completed` and value of `false` to obtain only documents that haven't been completed
  const itemsLeft = await db
    .collection("todos")
    .countDocuments({ completed: false });

  // Renders our view using `index.ejs` with the variables `todoItems` and `itemsLeft`
  response.render("index.ejs", { items: todoItems, left: itemsLeft });

  // db.collection('todos').find().toArray()
  // .then(data => {
  //     db.collection('todos').countDocuments({completed: false})
  //     .then(itemsLeft => {
  //         response.render('index.ejs', { items: data, left: itemsLeft })
  //     })
  // })
  // .catch(error => console.error(error))
});

// Use `post` method to create a custom request handler at the path `/addTodo`
app.post("/addTodo", (request, response) => {
  // Within the collection, insertOne() is used to call objects with the properties `thing` and `completed`, with `request.body.todoItem` and `false` as values for those properties, respectively
  db.collection("todos")
    .insertOne({ thing: request.body.todoItem, completed: false })
    // After insertOne() method, the page redirects to the path at `/`
    .then((result) => {
      console.log("Todo Added");
      response.redirect("/");
    })
    // If insertOne() method fails, we log the error to the browser console
    .catch((error) => console.error(error));
});

app.put("/markComplete", (request, response) => {
  db.collection("todos")
    .updateOne(
      { thing: request.body.itemFromJS },
      {
        $set: {
          completed: true,
        },
      },
      {
        sort: { _id: -1 },
        upsert: false,
      }
    )
    .then((result) => {
      console.log("Marked Complete");
      response.json("Marked Complete");
    })
    .catch((error) => console.error(error));
});

app.put("/markUnComplete", (request, response) => {
  db.collection("todos")
    .updateOne(
      { thing: request.body.itemFromJS },
      {
        $set: {
          completed: false,
        },
      },
      {
        sort: { _id: -1 },
        upsert: false,
      }
    )
    .then((result) => {
      console.log("Marked Complete");
      response.json("Marked Complete");
    })
    .catch((error) => console.error(error));
});

app.delete("/deleteItem", (request, response) => {
  db.collection("todos")
    .deleteOne({ thing: request.body.itemFromJS })
    .then((result) => {
      console.log("Todo Deleted");
      response.json("Todo Deleted");
    })
    .catch((error) => console.error(error));
});

app.listen(process.env.PORT || PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
