let express = require("express");
let app = express();
let path = require("path");
let bodyParser = require('body-parser')

app.use(express.static(path.join(__dirname, "../")));
app.use(bodyParser.json());

app.get("/", (req, res) => res.sendFile("index.html"));
app.use("/api", require("./api/todo.api"));

app.set('port', process.env.PORT || 3000);
var server = app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + server.address().port);
});