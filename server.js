const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
var users = require("./routes/api/register");
var indexRouter = require('./routes/index');
const passport = require("passport");


app.use(
    bodyParser.urlencoded({
        extended: false
    })
);

const dbKeys = require('./config/keys').mongoURI;

mongoose.connect(dbKeys,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log("db conncted"))
    .catch(err => console.log(err));

app.use(passport.initialize());
require("./config/passport")(passport);

app.use('/', indexRouter);

app.use('/api/', users);

const port = 5000;
app.listen(port, () => console.log("app is started at " + port));