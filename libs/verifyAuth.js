import ('express');
const jwt = require('jsonwebtoken');
const func =(token,key)=>{
	return jwt.verify(token, process.env.SECRET_KEY , (err, data)=>{
		if(err)
			console.log("Erro in token verification: ",err);
		else
		{
			return data;
		}
	});
};
module.exports = func;