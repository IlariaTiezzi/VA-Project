// create a connector to access the database
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('../data/vast2015_mc1.db');

// initialize express 
var express = require('express');
var restapi = express();

// Include the File System module 
var http = require ('http');
var fs = require('fs');

// define a entry point to to receive the coordinates and count all movements of users
restapi.get('/we-groups', function(req, res){
	
	db.all('SELECT x, y, COUNT(id) AS users FROM movs WHERE id IS NOT NULL AND tag = "movement" GROUP BY x, y ORDER BY x ASC',
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
	  		res.write('<p>File json saved successfully!</p>');
	  		res.write('<p>You can see the result here: <a href="http://localhost/va_project/">VAST PROJECT</a></p>');

	  		//Write a response to the console
	  		console.log('File json saved successfully!');

	  		// End the response  		
	  		res.end();
	  		
		}); 		 			
	});
});

// define a entry point to to count the number of check-in per hour of the day and position
restapi.get('/we-area', function(req, res){

	db.all('SELECT strftime("%d", ts) AS day, CASE WHEN x <= 50 AND y >= 54 AND y <= 99 THEN "Tundra Land" WHEN x >= 50 AND x <= 70 AND y >= 54 AND y <= 99 THEN "Entry Corridor" WHEN x >= 70 AND x <= 99 AND y >= 54 AND y <= 99 THEN "Kiddie Land" WHEN x >= 70 AND x <= 99 AND y >= 54 AND y <= 99 THEN "Kiddie Land" WHEN x <= 82 AND y >= 31 AND y <= 54 THEN "Wet Land" ELSE "Coaster Alley" END as area, COUNT(id) AS users  FROM movs WHERE id IS NOT NULL AND tag = "check-in" GROUP BY day, area',
	function(err, rows){
		
		// Create the json objects from the result sql
		var json = JSON.stringify(rows);
		
		if (err) throw err;

		// Write the object inside a file json
		fs.writeFile('../data/we-area.json', json, 'utf8', function (err) {
	  		if (err) throw err;	 

	  		//Write a response to the client
	  		res.writeHead(200, {'Content-Type': 'text/html'});
	  		res.write('<h1>VAST Challenge 2015 - MC1</h1>');
	  		res.write('<h2>Project of Visual Analytics</h2>');
	  		res.write('<p>File json saved successfully!</p>');
	  		res.write('<p>You can see the result here: <a href="http://localhost/va_project/">VAST PROJECT</a></p>');

	  		//Write a response to the console
	  		console.log('File json saved successfully!');

	  		// End the response  		
	  		res.end();
	  		
		});		 			
	});
});

// define a entry point to to count the number of check-in per hour of the day
restapi.get('/we-h-day', function(req, res){
	
	db.all('SELECT strftime("%d", ts) AS day, strftime("%H", ts) AS hour, COUNT(distinct id) AS users FROM movs WHERE id IS NOT NULL AND tag = "check-in" GROUP BY day, hour ORDER BY day ASC',
	function(err, rows){
		
		// Create the json objects from the result sql
		var json = JSON.stringify(rows);
		
		if (err) throw err;

		// Write the object inside a file json
		fs.writeFile('../data/we-h-day.json', json, 'utf8', function (err) {
	  		if (err) throw err;	 

	  		//Write a response to the client
	  		res.writeHead(200, {'Content-Type': 'text/html'});
	  		res.write('<h1>VAST Challenge 2015 - MC1</h1>');
	  		res.write('<h2>Project of Visual Analytics</h2>');
	  		res.write('<p>File json saved successfully!</p>');
	  		res.write('<p>You can see the result here: <a href="http://localhost/va_project/">VAST PROJECT</a></p>');

	  		//Write a response to the console
	  		console.log('File json saved successfully!');

	  		// End the response  		
	  		res.end();
	  		
		});		 			
	});
});

// define a entry point to to count the number of check-in per hour of the day
restapi.get('/we-checkin-day', function(req, res){
	
	db.all('SELECT COUNT(id) AS users, strftime("%d", ts) AS day FROM movs WHERE id IS NOT NULL AND tag = "check-in" GROUP BY day ORDER BY day ASC',
	function(err, rows){
		
		// Create the json objects from the result sql
		var json = JSON.stringify(rows);
		
		if (err) throw err;

		// Write the object inside a file json
		fs.writeFile('../data/we-checkin-day.json', json, 'utf8', function (err) {
	  		if (err) throw err;	 

	  		//Write a response to the client
	  		res.writeHead(200, {'Content-Type': 'text/html'});
	  		res.write('<h1>VAST Challenge 2015 - MC1</h1>');
	  		res.write('<h2>Project of Visual Analytics</h2>');
	  		res.write('<p>File json saved successfully!</p>');
	  		res.write('<p>You can see the result here: <a href="http://localhost/va_project/">VAST PROJECT</a></p>');

	  		//Write a response to the console
	  		console.log('File json saved successfully!');

	  		// End the response  		
	  		res.end();
	  		
		});		 			
	});
});

// define a entry point to count the number of check-in per area and hour of friday
restapi.get('/we-h-area-fri', function(req, res){

	db.all('SELECT strftime("%H", ts) AS hour, CASE WHEN x <= 50 AND y >= 54 AND y <= 99 THEN "Tundra Land" WHEN x >= 50 AND x <= 70 AND y >= 54 AND y <= 99 THEN "Entry Corridor" WHEN x >= 70 AND x <= 99 AND y >= 54 AND y <= 99 THEN "Kiddie Land" WHEN x >= 70 AND x <= 99 AND y >= 54 AND y <= 99 THEN "Kiddie Land" WHEN x <= 82 AND y >= 31 AND y <= 54 THEN "Wet Land" ELSE "Coaster Alley" END as area, COUNT(id) AS users  FROM movs WHERE id IS NOT NULL AND strftime("%d", ts) = "06" AND tag = "check-in" GROUP BY hour, area',
	function(err, rows){
		
		// Create the json objects from the result sql
		var json = JSON.stringify(rows);
		
		if (err) throw err;

		// Write the object inside a file json
		fs.writeFile('../data/we-h-area-fri.json', json, 'utf8', function (err) {
	  		if (err) throw err;	 

	  		//Write a response to the client
	  		res.writeHead(200, {'Content-Type': 'text/html'});
	  		res.write('<h1>VAST Challenge 2015 - MC1</h1>');
	  		res.write('<h2>Project of Visual Analytics</h2>');
	  		res.write('<p>File json saved successfully!</p>');
	  		res.write('<p>You can see the result here: <a href="http://localhost/va_project/">VAST PROJECT</a></p>');

	  		//Write a response to the console
	  		console.log('File json saved successfully!');

	  		// End the response  		
	  		res.end();
	  		
		});		 			
	});
});

// define a entry point to count the number of check-in per area and hour of saturday
restapi.get('/we-h-area-sat', function(req, res){

	db.all('SELECT strftime("%H", ts) AS hour, CASE WHEN x <= 50 AND y >= 54 AND y <= 99 THEN "Tundra Land" WHEN x >= 50 AND x <= 70 AND y >= 54 AND y <= 99 THEN "Entry Corridor" WHEN x >= 70 AND x <= 99 AND y >= 54 AND y <= 99 THEN "Kiddie Land" WHEN x >= 70 AND x <= 99 AND y >= 54 AND y <= 99 THEN "Kiddie Land" WHEN x <= 82 AND y >= 31 AND y <= 54 THEN "Wet Land" ELSE "Coaster Alley" END as area, COUNT(id) AS users  FROM movs WHERE id IS NOT NULL AND strftime("%d", ts) = "07" AND tag = "check-in" GROUP BY hour, area',
	function(err, rows){
		
		// Create the json objects from the result sql
		var json = JSON.stringify(rows);
		
		if (err) throw err;

		// Write the object inside a file json
		fs.writeFile('../data/we-h-area-sat.json', json, 'utf8', function (err) {
	  		if (err) throw err;	 

	  		//Write a response to the client
	  		res.writeHead(200, {'Content-Type': 'text/html'});
	  		res.write('<h1>VAST Challenge 2015 - MC1</h1>');
	  		res.write('<h2>Project of Visual Analytics</h2>');
	  		res.write('<p>File json saved successfully!</p>');
	  		res.write('<p>You can see the result here: <a href="http://localhost/va_project/">VAST PROJECT</a></p>');

	  		//Write a response to the console
	  		console.log('File json saved successfully!');

	  		// End the response  		
	  		res.end();
	  		
		});		 			
	});
});

// define a entry point to count the number of check-in per area and hour of sunday
restapi.get('/we-h-area-sun', function(req, res){

	db.all('SELECT strftime("%H", ts) AS hour, CASE WHEN x <= 50 AND y >= 54 AND y <= 99 THEN "Tundra Land" WHEN x >= 50 AND x <= 70 AND y >= 54 AND y <= 99 THEN "Entry Corridor" WHEN x >= 70 AND x <= 99 AND y >= 54 AND y <= 99 THEN "Kiddie Land" WHEN x >= 70 AND x <= 99 AND y >= 54 AND y <= 99 THEN "Kiddie Land" WHEN x <= 82 AND y >= 31 AND y <= 54 THEN "Wet Land" ELSE "Coaster Alley" END as area, COUNT(id) AS users  FROM movs WHERE id IS NOT NULL AND strftime("%d", ts) = "08" AND tag = "check-in" GROUP BY hour, area',
	function(err, rows){
		
		// Create the json objects from the result sql
		var json = JSON.stringify(rows);
		
		if (err) throw err;

		// Write the object inside a file json
		fs.writeFile('../data/we-h-area-sun.json', json, 'utf8', function (err) {
	  		if (err) throw err;	 

	  		//Write a response to the client
	  		res.writeHead(200, {'Content-Type': 'text/html'});
	  		res.write('<h1>VAST Challenge 2015 - MC1</h1>');
	  		res.write('<h2>Project of Visual Analytics</h2>');
	  		res.write('<p>File json saved successfully!</p>');
	  		res.write('<p>You can see the result here: <a href="http://localhost/va_project/">VAST PROJECT</a></p>');

	  		//Write a response to the console
	  		console.log('File json saved successfully!');

	  		// End the response  		
	  		res.end();
	  		
		});		 			
	});
});

// define a entry point to count the number of movements during the days
restapi.get('/we-mov', function(req, res){

	db.all('SELECT strftime("%d", ts) AS day, strftime("%H", ts) AS hour, COUNT(id) AS users FROM movs WHERE id IS NOT NULL AND tag = "movement" GROUP BY day, hour ORDER BY hour ASC',
	function(err, rows){
		
		// Create the json objects from the result sql
		var json = JSON.stringify(rows);
		
		if (err) throw err;

		// Write the object inside a file json
		fs.writeFile('../data/we-mov.json', json, 'utf8', function (err) {
	  		if (err) throw err;	 

	  		//Write a response to the client
	  		res.writeHead(200, {'Content-Type': 'text/html'});
	  		res.write('<h1>VAST Challenge 2015 - MC1</h1>');
	  		res.write('<h2>Project of Visual Analytics</h2>');
	  		res.write('<p>File json saved successfully!</p>');
	  		res.write('<p>You can see the result here: <a href="http://localhost/va_project/">VAST PROJECT</a></p>');

	  		//Write a response to the console
	  		console.log('File json saved successfully!');

	  		// End the response  		
	  		res.end();
	  		
		});		 			
	});
});


restapi.listen(3000);
console.log("Listening on port 3000...");



