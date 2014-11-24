var express = require("express");
var path = require("path");
var Remote = require('./ripple-lib').Remote;

var app = express();

var remote = new Remote({
	servers: [ 'wss://s1.ripple.com:443' ] 
});

/*	a wrapper for Ripple Remote to provide API for the client*/
var rippleAPI = {
	getAccountInfo: function(req, res){	
		if(!remote.isConnected()) return res.send(errorResponse("remote is not connected"));
		remote.requestAccountInfo({account: req.params.account}, function(err, data){
			if(err)	return res.send(errorResponse(err && err.remote && err.remote.error_message, err));
			return res.send(successResponse(data));
		});
	},
	getAccountLines: function(req, res){
		if(!remote.isConnected())		return res.send(errorResponse("remote is not connected"));
		remote.requestAccountLines({account: req.params.account}, function(err, data){
			if(err)	return res.send(errorResponse(err && err.remote && err.remote.error_message, err));
			return res.send(successResponse(data));
		})
	},
	remoteConnect: function(req, res){
		if(remote.isConnected())	return res.send(successResponse());
		remote.connect(function() {
			return res.send(successResponse());
		});
	},
	remoteDisconnect: function(req, res){
		if(!remote.isConnected())		return res.send(successResponse());;
		remote.disconnect(function(err, info) {
			res.send(successResponse());
		});
	},
};

var server = app.listen(3000, function () {
	var host = server.address().address;
	var port = server.address().port;

	console.log('client is at http://%s:%s/rippleClient', host, port)
});

manageRouting();

app.route("/rippleClient")
.get(function(req, res, next) {
	res.sendFile(path.join(__dirname, "frontend", "ripple-client.html"));	
});

app.use("/css", express.static(path.join(__dirname, "frontend", "css")));
app.use("/js", express.static(path.join(__dirname, "frontend", "js")));


/*	connects urls to corresponding handlers	*/
function manageRouting()
{
	for(var url in rippleAPI)
	{
		app.route(path.join("/rippleAPI", url, ":account?"))
		.get(
		(function(urlToCall){			// generating listeners
			return function(req, res){
				res.contentType("application/json");
				rippleAPI[urlToCall](req, res);
			}
		})(url)
		);
	}
}


/*	a wrapper for error reponses sent to client */
function errorResponse(errMsg, data)
{
	var d = data || {};
	d.success = false;
	d.errorMsg = errMsg || "Unknown error";	
	return JSON.stringify(d);
}

/*	a wrapper for successful reponses sent to client */
function successResponse(data)
{
	var d = data || {};
	d.success = true;
	return JSON.stringify(d);
}



