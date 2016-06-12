
//Jobs
var CronJob = require('cron').CronJob;
var frequency = '*/30 * * * * *';

// PostgreSQL
var pgp = require("pg-promise")(/*options*/);
var db = pgp("postgres://alejo:alejandro@inventario-gondolas.cb5016y9yvkl.us-west-2.rds.amazonaws.com:5432/inventarioGondolas");

// MongoDB
var MongoClient = require('mongodb').MongoClient;

new CronJob(frequency, function() {
	db.many("SELECT category,sum(stock) as stock FROM Product GROUP BY category").then(function (data) {
		
		saveBatchViewInMongoDB(data);
		
    })
    .catch(function (error) {
        console.log("ERROR: ", error);
    });  
	
}, null, true, 'America/Los_Angeles');


var saveBatchViewInMongoDB = function(data) {
	
	MongoClient.connect('mongodb://test:test@ds021969.mlab.com:21969/cloud', function(err, db) {
		if (err) {
			throw err;
		}
		db.collection('stockByCategory').save({_id:'stockByCategory',data},function(err, result) {
			if (err) {
				throw err;
			} 
			console.log('Batch view saved in Mongo DB');
		});
	});
	
};
