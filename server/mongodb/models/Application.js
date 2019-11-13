const mongoose = require('mongoose');

const { Schema } = mongoose;

// Create Schema
const ApplicationSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  streetaddress: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  workPhone: {
    type: String,
    required: true,
  },
  contactName: {
    type: String,
    required: true,
  },
  mobilePhone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  mission: {
    type: String,
    required: true,
  },
  productNeeds: {
    type: Array,
    required: false,
  },
  needsOtherExpand: {
    type: String,
    required: false,
  },
  stageNew: {
    type: String,
    required: false,
  },
  stageRadio: {
    type: String,
    required: false,
  },
  stageOtherExpand: {
    type: String,
    required: false,
  },
  availRadio: {
    type: String,
    required: false,
  },
  fieldRadio: {
    type: String,
    required: false,
  },
  productExtra: {
    type: String,
    required: false,
  },
  feedback: {
    type: String,
    required: false,
  },
  status: {
    type: Number,
    default: 0,
  },
  urlString: {
    type: String,
    required: false,
  },
  decision: {
    type: Boolean,
  },
}, {
  timestamps: {
    createdAt: 'submitted',
  },
});

let Application;

if (mongoose.models.Application) {
  Application = mongoose.model('Application');
} else {
  Application = mongoose.model('Application', ApplicationSchema);
}

module.exports = Application;
