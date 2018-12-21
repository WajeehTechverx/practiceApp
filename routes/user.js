const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const verifyToken = require('../libs/middleware');
const User = require('../models/user');
const Advertisement = require('../models/advertisement');
const Transaction = require('../models/transaction');
var fs = require('fs');





router.get('/:id', (req,res) => {
	if(!req.params.id)
				res.json({ success: false, message: 'ID was not provided' });
			else
			{
				//console.log("Applicants token is: "+req.token);
				User.findById({ _id: req.params.id }, (err, user) => {
			        if(err)
			        	res.json({ success: false, message: 'ID was not provided' });
			        else
			        	res.json({users: user});
		    	});
			}
});



router.delete('/:id', (req,res) => {
	if(!req.params.id)
		res.json({ success: false, message: 'ID was not provided' });
	else
	{
		User.deleteOne({_id: req.params.id} , (err , user) =>{
			if(err)
	       		res.json({ success: false, message: 'Not Deleted' });
	       	else
	       		res.json({ success: true, message: 'Deleted' });
		});
	}
});


router.put('/:id', (req,res) => {
	if(!req.params.id)
		res.json({ success: false, message: 'ID was not provided' });
	else
	{
		User.findById(req.params.id, function(err, user) {
		 	if (err)
		 		res.json({ success: false, message: 'Not User With this ID' });
		 	else
	  		{
	  			user.fName = req.body.fName;
				user.lName = req.body.lName;
				user.email = user.email;
				user.password = req.body.password;
				user.save(function(err){
					if (err)
					{
						res.json({success: false, message: "Cant Update "+ err});
					}
					else
					res.json({success: true, message: "Updated", user: user});
				});
			}
		});
	}
});


router.post('/postAdvertisement', (req, res) => {
    if (!req.body.itemName || !req.body.itemCategory || !req.body.itemOnGoPrice || !req.body.itemLowestPrice || !req.body.itemDescription || !req.body.imageLink)
        res.json({ success: false, message: 'You must provide all fields of item' });
    else
    {
    	var sellerMail;
	    	jwt.verify(req.token, process.env.SECRET_KEY , (err, data)=>{
			if(err)
				res.json("You are not authorized to post an ad.: ",err);
			else
			{
				sellerMail = data.user.email;
			}
		});

		
		try{
			
			//var imageContents = fs.readFileSync(req.body.imageLink);
			imageContents = "Image will be saved here"
		}catch(err){
			return res.json({message: "no iamge found on this path"});
		}

        const newAdvertisement = new Advertisement({
        itemName: req.body.itemName,
        itemCategory: req.body.itemCategory,
        itemOnGoPrice: req.body.itemOnGoPrice,
        itemLowestPrice: req.body.itemLowestPrice,
        itemDescription: req.body.itemDescription,
        sellerEmail: sellerMail,
        itemImage: imageContents
        });
        //console.log(newAdvertisement)
        if(newAdvertisement.itemOnGoPrice < newAdvertisement.itemLowestPrice)
        {
        	res.json({message: "Lowest price of the item is less than normal price "});
        }
        else
        {
        	newAdvertisement.save(function(err){
            if (err)
            {
                return res.json({msg:err.message+"ererrrrrrrrrrrrrrrrrr"});
            }
            else
            {
                res.json({message: "Advertisement has been posted"});
            }
        });
        }
        
    }
});



router.get('/searchItemsByName/:requiredItem',(req,res)=>{
	if(!requiredItem)
		return res.json({"message": "please provide a product you want to search fro."});
	else
	{
		Advertisement.find({itemName:  new RegExp(req.params.requiredItem, 'i')} , (err,data)=>{
			if(err)
				res.json({message: err});
			else
				res.json(data);
		});
	}
});

router.get('/searchItemsByCategory/:requiredItem',(req,res)=>{
	if(!requiredItem)
		return res.json({"message": "please provide a category you want to search fro."});
	else
	{
		Advertisement.find({itemCategory: new RegExp(req.params.requiredItem, 'i')} , (err,data)=>{
			if(err)
				res.json({message: err});
			else
				res.json(data);
		});
		
	}
});

router.put('/bidForProduct/:id', (req,res) => {
	if(!req.params.id)
		res.json({ success: false, message: 'ID of product was not provided' });
	else
	{
		Advertisement.findById(req.params.id, function(err, item) {
		 	if (err)
		 		res.json({ success: false, message: 'Not product With this ID' });
		 	else
	  		{
	  			if(req.body.offer < item.itemLowestPrice || req.body.offer > item.itemOnGoPrice )
	  				return res.json({"message": "Invalid bid. Offer a bid according to the lowest and Ongo price of the item"});
	  			var biddersMail;
		    	jwt.verify(req.token, process.env.SECRET_KEY , (err, data)=>{
					if(err)
						return res.json("You are not authorized to offer a bid: ",err);
					else
					{
						biddersMail = data.user.email;
						if(biddersMail == product.sellerEmail)
							return res.json({"message": "You are owner of the product so you cant bid for this product"})

					}
				});
	  			var temp = {"buyerMail": biddersMail, "offeredPrice": req.body.offer};
	  			item.offers[(item.offers).length] = temp;
				console.log("Length is: ",(item.offers).length);
				res.json(item)
			}
		});
	}
});

router.get('/acceptBid/:id',(req,res)=>{
	if(!req.params.id)
		return res.json({"message": "ID of the product is not provided."});
	else
	{
		Advertisement.findById({_id: req.params.id} , (err,product)=>{
			if(err)
				return res.json({"message": err});
			else
			{
				if(product.offers.length == 0)
					return res.json({"message": "No bid is offered yet"});
				else
				{
					var accepterMail;
			    	jwt.verify(req.token, process.env.SECRET_KEY , (err, user)=>{
						if(err)
							res.json("You are not authorized to accept the bid ",err);
						else
						{
							console.log("Product: "+product);
							accepterMail = user.user.email;
							if(product.sellerEmail !== accepterMail)
								res.json({"message": "You are not owner of the product you're trying to accept bid of"});
							else
							{
								var newTransaction = new Transaction({
									sellerMail: product.sellerEmail,
									buyerMail: req.body.buyerMail,
									productID: product._id,
									bidHistory: product.offers
								});

								newTransaction.save(function(err){
									if (err)
									{
										return res.json({success: false, message: "Cant creat transaction "+ err});
									}

									return res.json({success: true, message: "Transaction generated. Wait for the admin approval", details: newTransaction});

								});
							}
						}
					});
				}
			}
		});
		
	}
});

module.exports =  router;

