const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const timeStamp = require('mongoose-timestamp');


let itemNameLengthChecker = (itemName) => {
	if (!itemName || itemName.length < 4 || itemName.length > 35)
    	return false;
	else
    	return true;
};


let itemNameValidation = (itemName) => {
	if (!itemName)
		return false;
	else
	{
		const regExp = new RegExp(/^[a-zA-Z0-9]+$/);
		return regExp.test(itemName);
	}
};

const itemNameValidator = [
  {validator: itemNameLengthChecker, message: 'Errorin item name: Item name length mus be 5-35'},
  {validator: itemNameValidation, message: 'Errorin item name: Item name may contain digits or alphabets only'}
  ];


let itemCategoryLengthChecker = (itemCategory) => {
	if (!itemCategory || itemCategory.length < 5 || itemCategory.length > 100)
    	return false;
	else
    	return true;
};


let itemCategoryValidation = (itemCategory) => {
	if (!itemCategory)
		return false;
	else
	{
		const regExp = new RegExp(/^[a-zA-Z0-9,]+$/);
		return regExp.test(itemCategory);
	}
};

const itemCategoryValidator = [
  {validator: itemCategoryLengthChecker, message: 'Errorin item category: Item name length mus be 5-35'},
  {validator: itemCategoryValidation, message: 'Errorin item category: Item name may contain digits or alphabets only'}
  ];


let itemPriceValidation = (itemOnGoPrice) => {
	if (!itemOnGoPrice || itemOnGoPrice < 1 || itemOnGoPrice > 999999999999)
    	return false;
	else
    	return true;
};


const itemPriceValidator = [
  {validator: itemPriceValidation, message: 'Errorin item Price: Item price may be 1-999999999 $'}
  //{validator: itemPriceValidation, message: 'Errorin item Price: Item price may contain digits only'}
  ];


let itemDescriptionLengthChecker = (itemDescription) => {
	if (!itemDescription || itemDescription.length < 10 || itemDescription.length > 200)
    	return false;
	else
    	return true;
};


let itemDescriptionValidation = (itemDescription) => {
	if (!itemDescription)
		return false;
	else
	{
		const regExp = new RegExp(/^[a-zA-Z0-9 ]+$/);
		return regExp.test(itemDescription);
	}
};

const itemDescriptionValidator = [
  {validator: itemDescriptionLengthChecker, message: 'Errorin item description: Item description may be 20-200 characters long'},
  {validator: itemDescriptionValidation, message: 'Error in item Description: Item description may contain alphabets and digits only'}
  ];



const AdvertisementSchema = new Schema({
	itemName :{ type: String, validate: itemNameValidator },
	itemCategory: { type: String, validate: itemCategoryValidator },
	itemOnGoPrice: { type: Number, validate: itemPriceValidator},
	itemLowestPrice: { type: Number, validate: itemPriceValidator},
	itemDescription: { type: String, validate: itemDescriptionValidator},
	sellerEmail: { type: String},
	itemImage: { type: String},
	offers : [{ buyerMail: String, offeredPrice: Number}]
});

AdvertisementSchema.index({ itemName: 1, itemSellerId: 1 }, { unique: true })
AdvertisementSchema.plugin(timeStamp);

module.exports = mongoose.model('Advertisement', AdvertisementSchema);