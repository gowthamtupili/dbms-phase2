require('dotenv').config();

const express = require("express");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require('ejs-mate');
const app = express();





const port = process.env.PORT || 3000 ;


const mysql = require('mysql2');
const connection = mysql.createConnection(process.env.DATABASE_URL);



connection.connect();




app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));


let items = [
    {
        id: 1,
        name: 'sdaf',
        image: 'e',
        price: '$99',
        description: 'funny!'

    },
    {
        id: 2,
        name: 'Skyler',
        image: 'e',
        price: '$94',
        description: 'ds'
    },
    {
        id: 3,
        name: 'Sk8erBoi',
        image: 'e',
        price: '$89',
        description: 'ds'
    },
    {
        id: 4,
        name: 'sdh',
        image: 'e',
        price: '$77',
        description: 'sadjkn'
    }
]


app.get('/', (req, res) => {
    res.render('home');
})




app.get('/menu', (req, res) => {
    connection.query('SELECT * FROM menu_table', function (err, rows, fields) {
    if (err) throw err
    const items = rows;
    res.render('menu/items', { items });
    })
  })


//---------------------------------api to get ongoing orders------------------------------
app.get('/ongoing_orders', (req, res) => {
    connection.query('SELECT * FROM ongoing_orders', function (err, rows, fields) {
    if (err) throw err
    const data = rows;
    console.log(data);

    res.render('menu/ongoing', { data });
    })
  })


app.get('/menu/:id', (req, res) => {
    const { id } = req.params;
    const mitem = connection.query(`SELECT * from menu_table where dish_id=${id}`);
    console.log(mitem);
    res.render('menu/show', { mitem })
})

app.get('/ongoing_orders/new', (req, res) => {
    res.render('menu/ongoing');
})

app.post('/ongoing_orders/new', (req, res) => {
    console.log(`Request Body`);
    console.log( req.body );
    const { table_id, dish_id, quantity, accepted_or_not } = req.body;

    connection.query(`INSERT into ongoing_orders ( table_id, dish_id, quantity, accepted_or_not ) values(${table_id}, ${dish_id}, ${quantity}, ${accepted_or_not});`)
    res.send('success!');
})


app.patch('/')

app.get('/menuitems', (req, res) => {
    res.render('menu/menuItems');
})

app.all("*", (req, res, next) => {
    res.send(`Page not found`);
});

//---------------------------------api to access the ongoing orders of particular tables------------------------------
app.get('/menusdf/:id', (req, res) => {
    connection.query('SELECT * FROM menu_table where dish_id=?',[req.params.id], function (err, rows, fields) {
      if (err) throw err
        console.log(rows);
      res.send(rows)
    })
  })
app.listen(port, () => {
    console.log(`Serving on port ${port}`);
});