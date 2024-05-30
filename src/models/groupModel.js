const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  groupName: {
    type: String, 
    required: true, 
  },
  userId: {
    type: String, 
    ref: 'User',
    required : true,
  }, 
  name: {
    type: String, 
    ref: 'User',
  },
  privacyStatus : {
    type: String, 
    enum: ['public', 'private'], 
    default: 'public'
  },
}, { timestamps: true });

groupSchema.virtual('posts', { // posts is a parameter to get related objects.
  ref: 'Post', 
  localField: '_id',
  foreignField: 'groupId' // This is in post model.
});

groupSchema.virtual('users', { // users is a parameter to get related objects.
  ref: 'Membership', 
  localField: '_id',
  foreignField: 'groupId' // This is in user model.
});

groupSchema.set('toObject', { virtuals: true });
groupSchema.set('toJSON', { virtuals: true });

const Group = mongoose.model('Group', groupSchema);

module.exports = Group;
