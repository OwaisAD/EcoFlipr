const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const saleOfferSchema = new mongoose.Schema({
  description: {},
  category: {},
  is_shippable: {},
  phone_number: {},
  address: {},
  username: {
    type: String,
    required: true,
    unique: true,
    minLength: 3,
  },
  passwordHash: {
    type: String,
    required: true,
  },
});

saleOfferSchema.plugin(uniqueValidator);

saleOfferSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    // the passwordHash should not be revealed
    delete returnedObject.passwordHash;
  },
});

const SaleOffer = mongoose.model("SaleOffer", saleOfferSchema);

module.exports = SaleOffer;
export {};
