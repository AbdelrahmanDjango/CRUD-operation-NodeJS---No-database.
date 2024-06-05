const mongoose = require('mongoose');

const membershipSchema = new mongoose.Schema({
  userId: {
    type: String,
    ref: 'User',
    required: true,
  },
  // name: {
  //   type: String,
  //   ref: 'User',
  // },
  role : {
    type : String, 
    enum : ['user', 'admin'], 
    default : 'user'
  },
  groupId: {
    type: String,
    ref: 'Group',
    required: true
  },
  status : {
    type: String, 
    enum: ['pending', 'accepted', 'rejected'], 
    default: 'accepted'
  },
  
  
}, { timestamps: true });

const Membership = mongoose.model('Membership', membershipSchema);

module.exports = Membership;
