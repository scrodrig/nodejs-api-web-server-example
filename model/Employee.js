const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const employeeSchema = new Schema({
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model('Employee', employeeSchema);
// By default model names automatically looks for a plural and start with a capital letter
