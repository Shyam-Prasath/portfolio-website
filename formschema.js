const mongoose = require("mongoose")
const mongodb = require("mongodb")

const formSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true }
});

module.exports = mongoose.model("Form", formSchema);