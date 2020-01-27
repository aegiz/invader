var express = require("express");
var formidable = require("formidable");
var fs = require("fs");
var util = require("util");

const PORT = process.env.PORT || 3000;

var app = express();

app.get("/", function(req, res) {
	res.sendFile(__dirname + "/index.html");
});

app.post("/upload", function(req, res) {
	console.log("hello");

	new formidable.IncomingForm()
		.parse(req)
		.on("fileBegin", (name, file) => {
			file.path = __dirname + "/uploads/" + file.name;
		})
		.on("file", (name, file) => {
			console.log("Uploaded file", name, file);
		});

	// var form = new formidable.IncomingForm();

	// // form.parse(req);

	// form.on("fileBegin", function(name, file) {
	// 	console.log("Begin");
	// 	var currentdate = new Date();

	// 	file.path = __dirname + "/uploads/" + file.name;
	// 	console.log(__dirname + "/uploads/" + file.name);
	// });

	// // form.parse(req, function(err, fields, files) {
	// // 	fs.appendFile("fields.json", util.inspect(fields), function(err) {
	// // 		if (err) throw err;
	// // 		console.log("Log Saved!");
	// // 	});
	// // 	fs.appendFile("files.json", util.inspect(files), function(err) {
	// // 		if (err) throw err;
	// // 		console.log("Log Saved!");
	// // 	});
	// // });

	//res.sendFile(__dirname + "/index.html");
	res.sendFile(__dirname + "/test_reply.json");
});

app.listen(PORT, () => {
	console.log("Listening at " + PORT);
});
