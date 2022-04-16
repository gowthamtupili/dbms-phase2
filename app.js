const express = require("express");
const path = require("path");
const methodOverride = require("method-override");
const app = express();


app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));


app.get("/menu", (req, res) => {
    res.render('menu/items')
})

app.all("*", (req, res, next) => {
    res.send(`Page not found`);
});


app.listen(3000, () => {
    console.log(`Serving on port 3000`);
});