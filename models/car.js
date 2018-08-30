var mongoose = require("mongoose");
var Schema = mongoose.Schema({
    "sid": String,
    "name": String,
    "type": String,
    "price": String,
    "company": String,
    "zhuangtai": String
});
Schema.statics.add = function (json, callback) {
    this.create(json, function (err, r) {
        callback(err, r);
    });
};

Schema.statics.getAll = function (callback) {
    this.find({}).exec(function (err, results) {
        callback(results);
    });
};

Schema.statics.delete = function (arr, callback) {
    var _arr = [];
    arr.forEach(function (sid) {
        _arr.push({"sid": sid});
    });
    this.remove({$or: _arr}, function (err, r) {
        callback(err, r.n);
    });
};

Schema.statics.createStudent = function (array, grade, callback) {
    var studentARR = [];
    for (var i = 1; i < array.length; i++) {
        studentARR.push({
            "sid": array[i][1],
            "name": array[i][0],
            "price": array[i][2],
            "company": grade,
            "zhuangtai": zhuangtai
        })
    }
    this.create(studentARR, function (err, r) {
        callback(r.length, grade);
    });
}

var Course = mongoose.model("car", Schema);
module.exports = Course;