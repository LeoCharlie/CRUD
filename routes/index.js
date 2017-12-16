
var Post = require("../models/post");
var crypto = require("crypto");
function formatDate(num){
    return num < 10 ? '0' + num : num
}

module.exports = function (app) {
    //首页
    app.get("/",function (req,res) {
        var page = parseInt(req.query.page) || 1;
        console.log(page);
        Post.getSix(null,page,function (err, data,total) {
            console.log(page);
            console.log(total);
            if (err){
                data = [];
            }
                res.render("index", {
                    title: "CRUD Operation",
                    page:page,
                    isFirstPage: (page -1)*6 ==0,
                    isLastPage: ((page-1)*6 +data.length) == total,
                    success: req.flash('success').toString(),
                    error: req.flash('error').toString(),
                    data: data,
                })
        })
    })
    //添加用户
    app.post("/add",function (req,res) {
        var name = req.body.name;
        var username = req.body.username;
        var password = req.body.password;
        var re_password = req.body['re_password'];
        var phone = req.body.phone;
        var email = req.body.email;
        var newData = new Post(name,username,password,phone, email)
        if (re_password != password){
            req.flash('error',"用户两次密码不一致");
            return res.redirect('/');
        }
        //加密
        var md5 = crypto.createHash("md5");
        var password = md5.update(req.body.password).digest("hex");
        newData.save(function (err,data) {
            if(err){
              req.flash("err",err)
            }
            req.session.data = newData;
            req.flash("success","添加成功");
            res.redirect("/");
        })
    })
    //编辑
    app.get("/edit/:name/:username/:phone/:email",function (req,res) {
        Post.edit(req.params.name,req.params.username,req.params.phone,req.params.email,function (err,data) {
            if(err){
                req.flash("err",err);
            }
            return res.render("edit",{
                title:"编辑",
                data:data,
                success: req.flash('success').toString(),
                error: req.flash('error').toString()
            })
        })
    })
    //修改数据
    app.post('/change/:name/:username',function (req,res) {
        Post.update(req.params.name,req.params.username,req.body.password,req.body.phone,
            req.body.email,function (err,data) {

                if(err){
                    req.flash("err",err);
                    return res.redirect("/")
                }
                req.flash("success","修改成功");
                return res.redirect("/");
            })
        })
    //删除
    app.get('/remove/:name/:username/:phone/:email',function (req, res) {
        Post.remove(req.params.name,req.params.username,req.params.phone,req.params.email,function (err) {
            if(err){
                req.flash("err",err);
                return res.redirect("/")
            }
            req.flash("success","删除成功")
            return res.redirect("/");
        })
    })
    //搜索
    app.get("/search",function (req,res) {
        console.log(req.query.search);
        Post.search(req.query.search,function (err,data) {
            if(err){
                req.flash("err",err);
                return res.redirect("/");
            }
            res.render("search",{
                title:"搜索"+req.query.search,
                data:data,
                success: req.flash('success').toString(),
                error: req.flash('error').toString()
            })
        })
    })
}
