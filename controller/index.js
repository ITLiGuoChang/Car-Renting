var path = require("path");
var fs = require("fs");
var formidable = require("formidable");
var crypto = require("crypto");
var admin = require("../models/admin");
var kh = require("../models/kehu");
var car = require("../models/car");
var tool = require("../models/tool");
var lishi = require("../models/lishi");
var yizu = require("../models/yizu");
var guihuan = require("../models/guihuan");
var category = require("../models/leixing");
var url = require("url");

exports.showIndex = function (req, res) {
    res.render("../views/index");
};

exports.checklogin = function (req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        var username = fields.username;
        var password = fields.passworld;
        if (err) {
            res.json({"result": -1});
            return;
        }
        if (!username || !password) {
            res.json({"result": -4});
            return;
        }
        admin.findusername(username, function (err, results) {
            var theadmin = results[0];
            var sha256 = crypto.createHash("sha256");
            password = sha256.update(password).digest("hex").toString();
            if (theadmin.password == password) {
                req.session.username = username;
                req.session.type = "admin";
                req.session.login = true;
                res.json({"result": 1, "type": "admin"});
            } else {
                res.json({"result": -3});
            }
        })
    })
};

exports.showAdmin = function (req, res) {
    if (!(req.session.login && req.session.type == "admin")) {
        res.send("您还没有登录！请<a href=/>登录</a>");
        return;
    }
    res.render("../views/admin.ejs");
};

exports.showLease = function (req, res) {
    res.render("../views/lease");
};

exports.showReturn = function (req, res) {
    res.render("../views/return");
};

exports.showStatistics = function (req, res) {
    res.render("../views/statistics");
};

exports.showCategory = function (req, res) {
    res.render("../views/category");
};

exports.showCar = function (req, res) {
    res.render("../views/car");
};

exports.addkh = function (req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        kh.add(fields, function (err) {
            if (err) {
                res.send("提交失败");
            } else {
                res.send("提交成功")
            }
        })
    });
};

exports.allkh = function (req, res) {
    kh.getAll(function (results) {
        res.json({"results": results});
    })
};

exports.deletekh = function (req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields) {
        var needToDelete = JSON.parse(fields.needToDelete);
        kh.delete(needToDelete, function (err, n) {
            if (err) {
                res.send("-1");
            } else {
                res.send(n.toString());
            }
        });
    });
};

exports.addCategory = function (req, res) {
    var page = url.parse(req.url, true).query.page - 1 || 0;
    var pagesize = 5;
    category.count({}, function (err, count) {
        category.find({}).limit(pagesize).skip(pagesize * page).exec(function (err, results) {
            res.json({
                "pageAmount": Math.ceil(count / pagesize),
                "results": results
            });
        });
    });
};

exports.addCate = function (req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        category.find({"sid": fields.sid}, function (err, data) {
            if (data.length == 0) {
                var json = new category(fields);
                json.save(function (err) {
                    if (err) {
                        res.json({"result": -1});
                        return;
                    } else {
                        res.json({"result": 1});
                        return;
                    }
                })
            }
            else {
                res.json({"result": -2})
            }
        })
    })
};

exports.deleteCategory = function (req, res) {
    var sid = req.params.sid;
    category.find({"sid": sid}, function (err, results) {
        if (err || results.length == 0) {
            res.json({"result": -1});
            return;
        }
        results[0].remove(function (err) {
            if (err) {
                res.json({"result": -1});
                return;
            }
            res.json({"result": 1});
        });
    });
};

exports.addcar = function (req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        car.add(fields, function (err) {
            if (err) {
                res.send("提交失败");
            } else {
                res.send("提交成功")
            }
        })
    });
};

exports.allcar = function (req, res) {
    car.getAll(function (results) {
        res.json({"results": results});
    })
};

exports.deletecar = function (req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields) {
        var needToDelete = JSON.parse(fields.needToDelete);
        car.delete(needToDelete, function (err, n) {
            if (err) {
                res.send("-1");
            } else {
                res.send(n.toString());
            }
        });
    });
};

exports.showupdata = function (req, res) {
    var hanghao = req.params.sid;
    if (!hanghao) {
        return;
    }
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        kh.find({"sid": hanghao}, function (err, results) {
            if (results.length == 0) {
                res.json({"result": -1});
                return;
            }
            var thestudent = results[0];
            thestudent.sid = fields.sid;
            thestudent.name = fields.name;
            thestudent.phone = fields.phone;
            thestudent.address = fields.address;
            thestudent.icard = fields.icard;
            thestudent.car = fields.car;
            thestudent.save(function (err) {
                if (err) {
                    res.json({"result": -1});
                } else {
                    res.json({"result": 1});
                }
            })
        })
    });
};

exports.showUpdatacar = function (req, res) {
    var hanghao = req.params.sid;
    if (!hanghao) {
        return;
    }
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        car.find({"sid": hanghao}, function (err, results) {
            if (results.length == 0) {
                res.json({"result": -1});
                return;
            }
            var thestudent = results[0];
            thestudent.sid = fields.sid;
            thestudent.name = fields.name;
            thestudent.type = fields.type;
            thestudent.price = fields.price;
            thestudent.company = fields.company;
            thestudent.zhuangtai = fields.zhuangtai;
            thestudent.save(function (err) {
                if (err) {
                    res.json({"result": -1});
                } else {
                    res.json({"result": 1});
                }
            })
        })
    });
};

exports.showList = function (req, res) {
    var page = url.parse(req.url, true).query.page - 1 || 0;
    var pagesize = 5;
    category.count({}, function (err, count) {
        category.find({}).limit(pagesize).skip(pagesize * page).exec(function (err, results) {
            res.json({
                "results": results
            });
        });
    });
};

exports.showCarlist = function (req, res) {
    car.find({}).exec(function (err, results) {
        res.json({"result": results});
    });
};

exports.getche = function (req, res) {
    var name = url.parse(req.url, true).query;
    var carname = name.chexi;
    Student.getzhiding(carname, function (data) {
        res.json({"results": data});
    })
};

exports.zuche = function (req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        var carname = fields.carname;
        var kehu = fields.kehu;
        var day = fields.day;
        var json = {"carname": fields.carname};
        tool.zuche(carname, kehu, day, function (resultnumber) {
            res.json({"jieguo": resultnumber});
        });
        lishi.add(json, function (err, r) {
            console.log(r);
        })
    })
};
exports.showChuzu = function (req, res) {
    var sid = req.params.sid;
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        //更改学生
        console.log(fields.zhuangtai);
        car.update({"sid": sid}, {$set: {"zhuangtai": fields.zhuangtai}}, function (err) {
            if (err) {
                res.json({"result": -1});
            } else {
                res.json({"result": 1});
            }
        })
    });
};

exports.zuAddStudent = function (req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        yizu.addStudent(fields, function (result) {
            res.json({"result": result});
        });
    });
};

exports.returncar = function (req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        guihuan.remove(fields, function (result) {
            res.json({"result": result});
        });
    });
};

exports.getreturncar = function (req, res) {
    yizu.find({}).exec(function (err, results) {
        res.json({"result": results});
    });
};

exports.getAllGui = function (req, res) {
    var page = url.parse(req.url, true).query.page - 1 || 0;
    var pagesize = 5;
    guihuan.count({}, function (err, count) {
        guihuan.find({}).limit(pagesize).skip(pagesize * page).exec(function (err, results) {
            res.json({
                "pageAmount": Math.ceil(count / pagesize),
                "results": results
            });
        });
    });
}


exports.guihuan = function (req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        guihuan.addStudent(fields, function (err) {
            if (err) {
                res.send("提交失败");
            } else {
                res.send("提交成功")
            }
        })
    });
};
// 删除
exports.shanChu = function (req, res) {
    var sid = req.params.sid;
    yizu.find({"sid": sid}, function (err, data) {
        data[0].remove(function (err,data) {
            if (err){
                res.json({"S":-1})
                return
            }
            res.json({"S":1})
        })
    })
};
//修改
exports.xiuGai=function (req,res) {
    var sid = req.params.sid;
    car.find({"sid":sid},function (err,data) {
        var rest=data[0];
        rest.sid=rest.sid;
        rest.name=rest.name;
        rest.type=rest.type;
        rest.price=rest.price;
        rest.zhuangtai="待出租";
        rest.save()
    })
};

exports.TongZucar=function (req, res) {
    yizu.find({}).exec(function(err,results){
        res.json({"result":results});
    });
};
exports.TongHuancar=function (req, res) {
    guihuan.find({}).exec(function(err,results){
        res.json({"result":results});
    });
};