var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;

var TermSchema = new Schema({
  name: String,
  start: Date,
  end: Date,
  active: Boolean,
  status: {
    currentSemester: Boolean,
    viewable: Boolean,
    openForProposal: Boolean,
    openForApply: Boolean
  }
});

module.exports = mongoose.model('Terms', TermSchema);
