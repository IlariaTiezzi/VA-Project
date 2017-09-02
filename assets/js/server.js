

// create a connector to access the database
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('../data/vast2015_mc1.db');

// initialize express 
var express = require('express');
var restapi = express();

// Include the File System module 
var http = require ('http');
var fs = require('fs');

// define a entry point to to receive the coordinates and count all users on movements
restapi.get('/we-groups', function(req, res){
	
	db.all('SELECT x, y, COUNT(id) AS members FROM movs WHERE id IS NOT NULL AND tag = "movement" GROUP BY x, y ORDER BY x ASC',
	function(err, rows){
		
		// Create the json objects from the result sql
		var json = JSON.stringify(rows);
		
		if (err) throw err;

		// Write the object inside a file json
		fs.writeFile('../data/we-groups.json', json, 'utf8', function (err) {
	  		if (err) throw err;	 

	  		//Write a response to the client
	  		res.writeHead(200, {'Content-Type': 'text/html'});
	  		res.write('<h1>VAST Challenge 2015 - MC1</h1>');
	  		res.write('<h2>Project of Visual Analytics</h2>');
	  		res.write('<p>Saved json file successfully!</p>');
	  		res.write('<p>You can see the result here: <a href="http://localhost/va_project/">VAST PROJECT</a></p>');

	  		//Write a response to the console
	  		console.log('Saved json file successfully!');

	  		// End the response  		
	  		res.end();
	  		
		}); 		 			
	});
})


restapi.listen(3000);
console.log("Listening on port 3000...");



