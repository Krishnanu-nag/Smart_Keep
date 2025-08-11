const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Group name is required'] 
  },
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: [true, 'Creator ID is required'] 
  },
  members: [
    {
      userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: [true, 'Member userId is required'] 
      },
      role: { 
        type: String, 
        enum: ['admin', 'member'], 
        default: 'member',
        required: [true, 'Role is required'] 
      }
    }
  ],
  inviteLink: { 
    type: String, 
    unique: true, 
    required: [true, 'Invite link is required'] 
  }
}, { timestamps: true });

module.exports = mongoose.model('Group', groupSchema);
