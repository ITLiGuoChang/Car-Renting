var mongoose = require("mongoose");
var Schema = mongoose.Schema({
    "sid": String,
    "name": String,
    "phone": String,
    "address": String,
    "icard": String,
    "car": String,
    "days": Number,
    "qian": Number,
    "jg": Number,
    "sfzc": Number
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

var Course = mongoose.model("kehu", Schema);
module.exports = Course;