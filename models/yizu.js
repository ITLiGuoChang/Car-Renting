var mongoose = require('mongoose');


var yizuSchema = new mongoose.Schema({
    sid: Number,
    proname: String,
    carname: String,
    day: Number,
    daymoney: Number,
    pay: Number,
    yingpay: Number
});


yizuSchema.statics.addStudent = function (json, callback) {
    yizu.checkSid(json.sid, function (torf) {
        if (torf) {
            var s = new yizu(json);
            s.save(function (err) {
                if (err) {
                    callback(-2);
                    return;
                }
                callback(1);
            });
        } else {
            callback(-1);
        }
    });
}


yizuSchema.statics.checkSid = function (sid, callback) {
    this.find({"sid": sid}, function (err, results) {
        callback(results.length == 0);
    });
}


var yizu = mongoose.model("yizu", yizuSchema);
module.exports = yizu;