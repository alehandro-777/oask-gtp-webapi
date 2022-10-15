const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const model = new Schema({
    begin: { type: Date, default: Date.now  },
    end: { type: Date, default: Date.now  },
    excel_report: { type: Number, ref: 'excel-reports' },
    data: []
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: false}
  });

module.exports = mongoose.model('excel-rep-results', model); 