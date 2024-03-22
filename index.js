import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "books",
  password: "password1234",
  port: 5432,
});

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

async function getBooks() {
  const result = await db.query("SELECT * FROM books");
  let books = [];
  result.rows.forEach((book) => {
    books.push(book);
  });
  return books;
}
//read books
app.get("/", async (req, res) => {
  const books = await getBooks();
  res.render("index.ejs", { books: books });
});

//create
app.post("/add", async (req, res) => {
  if (req.body.add == "Add Book") {
    res.render("add.ejs");
  } else {
    const { title, description, rating } = req.body;
    const result = await db.query(
      "INSERT INTO books (title, description, rating) VALUES($1, $2, $3) RETURNING *;",
      [title, description, rating]
    );
    console.log(result.rows)
    res.redirect("/")
  }
});
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
