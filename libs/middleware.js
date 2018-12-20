const routes = require('../config/routesPermission');
const verify = require('./verifyAuth');
const url = require("url");


const middlewareAuthentication = async (req, res, next)=>
{
	var pathname = url.parse(req.originalUrl).pathname;
	const bearerHeader = req.headers.authorization
	if(typeof bearerHeader !== 'undefined')
	{
		const bearer = bearerHeader.split(' ');
		const bearerToken = bearer[1];
		req.token = bearerToken;
		let data = verify(req.token,process.env.SECRET_KEY)
		if(data)
		{
			if(routes[data.user.role].indexOf(pathname)>-1);
			{
				console.log("Token verified");
				next();
			}
		}
		else
		{
			console.log("Token not verified in middleware");			
			res.json({msg: "Forbidden"});
		}	
	}
	else
	{
		res.sendStatus(403);
	}
};
module.exports = middlewareAuthentication; 