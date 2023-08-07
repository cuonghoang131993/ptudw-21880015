"use strict";

const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const expressHandlerbars = require('express-handlebars');

//  Cau hinh public static folder
app.use(express.static(__dirname + '/public'));

// Cau hinh su dung express-handlebars
app.engine('hbs', expressHandlerbars.engine({
  layoutsDir: __dirname + '/views/layouts',
  partialsDir: __dirname + '/views/partials',
  extname: 'hbs',
  defaultLayout: 'layout'
}));
app.set('view engine', 'hbs');

// routes
app.get('/createTables', (req, res) => {
  let models = require('./models');
  models.sequelize.sync().then(() => {
    res.send('tables created');
  });
});

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/:page', (req, res) => {
res.render(req.params.page);
});

// Khoi dong web server
app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
