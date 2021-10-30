import express from "express";
import path from "path";

const app = express();

const port = 3000;

app.get("/", function (req, res) {
  res.sendFile(path.join(path.resolve("public", "index.html")));
});

app.get("/bundle.js", function (req, res) {
  res.sendFile(path.join(path.resolve("public", "bundle.js")));
});

app.listen(port, () => {
  console.log("Server started on port" + port);
});
