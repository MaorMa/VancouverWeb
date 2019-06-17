const express = require("express");
var cors = require('cors');
const app = express();

var UserHandle = require('./modules/UserHandle');
var POI = require('./modules/POI');

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(cors({origin: 'http://localhost:3001'}));
app.use('/poi', POI);
app.use('/users', UserHandle);

const port = process.env.PORT || 3000; //environment variable
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
