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



app.get('/', (req, res) => {
    res.render('home');
})




app.get('/menu', (req, res) => {
    connection.query('SELECT * FROM menu_table', function (err, items, fields) {
    if (err) throw err
    res.render('menu/items', { items });
    })
  })


//---------------------------------api to get ongoing orders------------------------------
app.get('/ongoing_orders', (req, res) => {
    connection.query('SELECT * FROM ongoing_orders', function (err, data, fields) {
    if (err) throw err
    console.log(data);

    res.render('menu/ongoing', { data });
    })
  })




app.get('/ongoing_orders/new', (req, res) => {
    res.render('menu/ongoing');
})

app.post('/ongoing_orders/new', (req, res) => {
    // console.log(`Request Body`);
    console.log( req.body );
    const { table_id, dish_id, quantity, accepted_or_not } = req.body;

    connection.query(`INSERT into ongoing_orders ( table_id, dish_id, quantity, accepted_or_not ) values(${table_id}, ${dish_id}, ${quantity}, ${accepted_or_not});`)
    res.redirect('/menu');
})


app.get('/admin_login_cred', (req, res) => {
  res.render('menu/login');
  
})

app.post('/admin_login_cred', (req, res) => {
  const { username, password } = req.body;
  connection.query('SELECT * FROM admin_credentials limit 1', function (err, data, fields) {
    if (err) throw err
    console.log(data);
    const data1 = data[0];
    if(data1.username === username && data1.password === password){
      const table_id = 2;
      res.render('menu/admin_dashboard', { table_id });
    }
    })
  

})



app.get('/menu/:id/update', (req, res) => {
      connection.query('SELECT * FROM menu_table where dish_id=?',[req.params.id], function (err, foundItem1, fields) {
        if (err) throw err
        console.log(foundItem1);
        res.render('menu/update', { foundItem1 });
      })
      

})

app.patch('/menu/:id', (req, res) => {
    const { id } = req.params;
    const { cost, available_or_not } = req.body
    connection.query(`update menu_table set cost= ${cost}, available_or_not = ${available_or_not} where dish_id= ${id}`);
    res.redirect('/menu');
})

app.get('/menuitems', (req, res) => {
    res.render('menu/menuItems');
})


app.get('/menu/:id', (req, res) => {
    const { id } = req.params;
    const mitem = connection.query(`SELECT * from menu_table where dish_id=${id}`);
    console.log(mitem);
    res.render('menu/show', { mitem })
})



app.all("*", (req, res, next) => {
    res.send(`Page not found`);
});

//---------------------------------api to access the ongoing orders of particular tables------------------------------
// app.get('/menusdf/:id', (req, res) => {
//     connection.query('SELECT * FROM menu_table where dish_id=?',[req.params.id], function (err, rows, fields) {
//       if (err) throw err
//         console.log(rows);
//       res.send(rows)
//     })
//   })
app.listen(port, () => {
    console.log(`Serving on port ${port}`);
});