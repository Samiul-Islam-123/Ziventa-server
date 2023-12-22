const mongoose = require('mongoose');
const ChartSchema = new mongoose.Schema({
    date: { type: Date, default: Date.now },
    numberOfOrdersDelivered: { type: Number, default: 0 }
})

const ChartModel = mongoose.model('chart', ChartSchema);

module.exports = ChartModel;