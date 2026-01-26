const mongoose = require('mongoose');

const distributionSchema = new mongoose.Schema({
  fileName: {
    type: String,
    required: true
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  },
  distributions: [
    {
      agentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Agent',
        required: true
      },
      agentName: String,
      items: [
        {
          firstName: String,
          phone: String,
          notes: String
        }
      ]
    }
  ],
  totalItems: Number
});

module.exports = mongoose.model('Distribution', distributionSchema);
