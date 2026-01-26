const mongoose = require('mongoose'); // import mongoose for MongoDB object modeling
const bcrypt = require('bcryptjs'); // import bcryptjs to hash and compare passwords

const agentSchema = new mongoose.Schema({ // define the Agent schema
  name: { // agent's full name
    type: String, // the type is String
    required: true // name is required
  },
  email: { // agent's email address
    type: String, // the type is String
    required: true, // email is required
    unique: true, // email must be unique across documents
    lowercase: true // store email in lowercase for consistency
  },
  mobile: { // agent's mobile number
    type: String, // stored as a String to preserve formatting
    required: true // mobile is required
  },
  password: { // agent's password (will be hashed before save)
    type: String, // stored as a String
    required: true // password is required
  },
  tasks: [ // array of task objects assigned to the agent
    { // single task entry
      firstName: String, // client's first name for the task
      phone: String, // client's phone number for the task
      notes: String // notes associated with the task
    }
  ],
  createdAt: { // timestamp when the agent was created
    type: Date, // stored as Date
    default: Date.now // defaults to current date/time
  }
}); // end of schema definition

// Hash password before saving
agentSchema.pre('save', async function () { // pre-save middleware to hash passwords
  if (!this.isModified('password')) return; // skip if password wasn't modified
  const salt = await bcrypt.genSalt(10); // generate a salt with 10 rounds
  this.password = await bcrypt.hash(this.password, salt); // hash and set the password
});

// Method to compare password
agentSchema.methods.comparePassword = async function (enteredPassword) { // instance method to compare a given password
  return await bcrypt.compare(enteredPassword, this.password); // returns true if password matches
};

module.exports = mongoose.model('Agent', agentSchema); // export the Agent model
