const functions = require("firebase-functions");
const express = require("express");
var formidable = require("formidable");
const cors = require("cors");
const app = express();

// Automatically allow cross-origin requests
app.use(cors({ origin: true }));

app.get("/", function(req, res) {
	res.sendFile(__dirname + "/index.html");
});

app.get("/upload", function(req, res) {
	res.sendFile(__dirname + "/upload.html");
});

app.post("/upload", function(req, res) {
	res.end("Received POST request!");
	var form = new formidable.IncomingForm();

	form.parse(req);

	form.on("fileBegin", function(name, file) {
		console.log("Begin");
		var currentdate = new Date();

		file.path =
			__dirname +
			"/uploads/" +
			Math.floor(Math.random() * 1000000) +
			"_" +
			file.name;
	});

	form.on("file", function(name, file) {
		console.log("End");
		// fs.writeFile(
		// 	__dirname +
		// 		"/uploads/" +
		// 		Math.floor(Math.random() * 1000000) +
		// 		"_" +
		// 		file.name,
		// 	file,
		// 	function(err) {
		// 		if (err) throw err;
		// 	}
		// );
	});

	res.sendFile(__dirname + "/index.html");
	//res.sendFile(__dirname + "/test.json");
});

// Expose Express API as a single Cloud Function:
exports.widgets = functions.https.onRequest(app);
