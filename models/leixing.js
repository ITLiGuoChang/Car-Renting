var mongoose = require("mongoose");
var Schema = mongoose.Schema({
    'sid': Number,
    "category": String
});
Schema.statics.add = function (json, callback) {
    Course.checkSid(json.sid, function (torf) {
        if (torf) {
            var s = new Course(json);
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
};

Schema.statics.checkSid = function (sid, callback) {
    this.find({"sid": sid}, function (err, results) {
        callback(results.length == 0)
    })
};

// Schema.statics.getAll = function (callback) {
//     this.find({}).exec(function (err, results) {
//         callback(results);
//     });
// };

// Schema.statics.delete = function (arr, callback) {
//     var _arr = [];
//     arr.forEach(function (item) {
//         _arr.push({"name": item});
//     });
//     this.remove({$or: _arr}, function (err, r) {
//         callback(err, r.n);
//     });
// };

var Course = mongoose.model("leixing", Schema);
module.exports = Course;