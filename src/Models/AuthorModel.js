const mongoose = require('mongoose')
const AuthorSchema = new mongoose.Schema({
   fname: {
      type: String,
      require: 'First Name is Required',
      trim:true
   },
   lname: {
      type: String,
      require: 'Last Name is Required',
      trim:true
   },
   title: { type: String, enum: ["Mr", "Mrs", "Miss"], required: 'Title is Required' },

   email: { type: String,
required: 'Email Address is Required',
lowercase:true,
unique: true
 },
   password: {
      type: String,
      trim:true,
      required: 'password is required'
   }
},
   { timestamps: true })

module.exports = mongoose.model('AuthorModel', AuthorSchema)

