var express = require('express');
var app = express();
var mongoose = require('mongoose');
var session = require("express-session");
var manctrl = require("./controller/index");
mongoose.connect('mongodb://localhost:27017/zuche');
app.set("view engine", "ejs");
app.set("views", "public");
app.set('trust proxy', 1);
app.use("/public", express.static("./public"));
app.use(session({
    secret: 'kaola',
    resave: false,
    saveUninitialized: true
}));

app.get("/", manctrl.showIndex);//显示首页
app.post("/checklogin", manctrl.checklogin);//检验登录
app.get("/admin", manctrl.showAdmin);//客人查询
app.get("/lease", manctrl.showLease);//租赁登记
app.get("/return", manctrl.showReturn);//归还登记
app.get("/statistics", manctrl.showStatistics);//统计分析
app.get("/category", manctrl.showCategory);//类别档案
app.get("/car", manctrl.showCar);//汽车档案
app.post("/admin/addkh", manctrl.addkh);//添加客户
app.get("/admin/allkh", manctrl.allkh);//获取所有客户
app.post("/admin/deletekh", manctrl.deletekh);//删除客户
app.get("/admin/addcategory", manctrl.addCategory);//添加车类别
app.post("/admin/addcategory", manctrl.addCate);//添加车类别
app.delete('/admin/addcategory/:sid', manctrl.deleteCategory);//删除车类别
app.post("/admin/addcar", manctrl.addcar);//添加汽车档案
app.get("/admin/allcar", manctrl.allcar);//获取所有汽车档案
app.post("/admin/deletecar", manctrl.deletecar);//删除汽车档案
app.post("/updata/:sid", manctrl.showupdata);//首页修改
app.post("/updatacar/:sid", manctrl.showUpdatacar);//汽车档案修改
app.get("/admin/list", manctrl.showList);//显示类别
app.get("/admin/carlist", manctrl.showCarlist);//显示车表
app.get("/admin/getzhidingcar", manctrl.getche);//获得车
app.post("/admin/zuche", manctrl.zuche);//租车
app.post('/chuzu/:sid', manctrl.showChuzu);//显示出租出
app.post('/zuadd', manctrl.zuAddStudent);//租车添加
app.post("/returncar", manctrl.returncar);//返回车
app.get("/returncar/allcar", manctrl.getreturncar);//获取返回车
app.post("/guihuan", manctrl.guihuan);//归还
app.get("/shanchu/:sid", manctrl.shanChu);//删除
app.get("/xiugai/:sid", manctrl.xiuGai);//修改
app.get('/getAllGui', manctrl.getAllGui);//所有归还数据
app.get("/tongzu",manctrl.TongZucar);//统计
app.get("/tonghuan",manctrl.TongHuancar);//统计还车

app.listen(2018);
