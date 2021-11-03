import express from "express";
import path from "path";

const app = express();

app.get("/", function (req, res) {
  res.sendFile(path.join(path.resolve("public", "index.html")));
});

app.get("/bundle.js", function (req, res) {
  res.sendFile(path.join(path.resolve("public", "bundle.js")));
});

app.get("/style.css", function (req, res) {
  res.sendFile(path.join(path.resolve("public", "style.css")));
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Server started on port " + listener.address().port);
});
