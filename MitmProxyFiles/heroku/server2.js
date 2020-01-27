const express = require("express");
const Flatted = require("flatted");
const formidable = require("express-formidable");
var fs = require("fs");

var app = express();

app.use(formidable());

app.post("/upload", (req, res) => {
	fs.appendFile("log.txt", Flatted.stringify(req), function(err) {
		if (err) throw err;
		console.log("Log Saved!");
	});
});

app.listen(3000);
