require("dotenv").config();
const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Database connected successfully"))
  .catch((error) => console.log("Database connection error:", error));

/*A schema is a blueprint or structure for a document in a MongoDB collection.
 It defines the shape of the documents within that collection, specifying fields, 
 their data types, and optionally, validations, default values, and other constraints.
Essentially, a schema describes how the documents should look.*/
const TodoSchema = mongoose.Schema({
  title: String,
  description: String,
  completed: Boolean,
});

//Model: Provides an interface for interacting with the database collection,
// allowing CRUD (Create, Read, Update, Delete) operations.
const todo = mongoose.model("todo", TodoSchema);

module.exports = {
  todo,
};
