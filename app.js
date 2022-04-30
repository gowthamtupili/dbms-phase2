const express = require("express");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require('ejs-mate');
const app = express();

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));


let items = [
    {
        author: 'dd',
        description: 'funny!'
    },
    {
        author: 'Skyler',
        description: 'ds'
    },
    {
        author: 'Sk8erBoi',
        description: 'ds'
    },
    {
        author: 'sdh',
        description: 'sadjkn'
    }
]


app.get('/', (req, res) => {
    res.render('home');
})

app.get("/menu", (req, res) => {
    res.render('menu/items', { items })
})

app.get('/menuitems', (req, res) => {
    res.render('menu/menuItems');
})

app.all("*", (req, res, next) => {
    res.send(`Page not found`);
});


app.listen(3000, () => {
    console.log(`Serving on port 3000`);
});