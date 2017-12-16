var mongo = require("./db");
function Post(name,username,password,phone,email) {
    this.name = name;
    this.username = username;
    this.phone = phone;
    this.email = email;
    this.password = password
}
//格式化时间的函数
function formatDate(num){
    return num < 10 ? '0' + num : num
}
//存储数据
Post.prototype.save = function (callback) {
    //1.格式化时间
    var date = new Date();
    var now = date.getFullYear() + '-' + formatDate(date.getMonth()+1)
        + '-' + formatDate(date.getDate()) + ' ' + formatDate(date.getHours())
        + ':' +formatDate(date.getMinutes()) + ':' + formatDate(date.getSeconds());
    //2.收集数据
    var newContent = {
        name:this.name,
        username:this.username,
        password:this.password,
        phone:this.phone,
        email:this.email,
        time:now
    }
    mongo.open(function (err,db) {
        if(err){
            return callback(err);
        }
        console.log(newContent);
        db.collection("datas",function (err,collection) {
            if(err){
                mongo.close();
                return callback(err);
            }
            collection.insert(newContent,function (err,data) {
                mongo.close();
                if(err){
                    return callback(err);
                }
                return callback(null,data);
            })
        })
    })
}
//获取数据
Post.getSix = function (name,page,callback) {
    mongo.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        db.collection("datas", function (err, collection) {
            if (err) {
                mongo.close();
                return callback(err);
            }
            var query = {};
            if (name) {
                query.name;
            }
            collection.count(query, function (err, total) {
                collection.find(query, {
                    skip: (page - 1) * 6,
                    limit: 6
                }).sort({
                    time: -1
                }).toArray(function (err, data) {
                    mongo.close();
                    if (err) {
                        return callback(err);
                    }

                    return callback(null, data, total);
                })
            })
        })
    })
//修改
    Post.edit = function (name, username, phone, email, callack) {
        mongo.open(function (err, db) {
            if (err) {
                return callback(err);
            }
            db.collection("datas", function (err, collection) {
                if (err) {
                    mongo.close();
                    return callback(err);
                }
                collection.findOne({
                    name: name,
                    username: username,
                    phone: phone,
                    email: email
                }, function (err, data) {
                    mongo.close();
                    if (err) {
                        return callback(err);
                    }
                    return callback(null, data);
                })
            })
        })
    }
//更新数据
    Post.update = function (name, username, pbassword, phone, email, callback) {
        mongo.open(function (err, db) {
            if (err) {
                return callback(err);
            }
            db.collection("datas", function (err, collection) {
                if (err) {
                    mongo.close();
                    return callback(err);
                }
                collection.update({
                    "name": name,
                    "username": username
                }, {
                    $set: {
                        "phone": phone,
                        "email": email,
                        "password": password
                    }
                }, function (err, doc) {
                    mongo.close();
                    if (err) {
                        return callback(err);
                    }
                    return callback(null, doc);
                })
            })
        })
    };
//删除数据
    Post.remove = function (name, username, phone, email, callback) {
        mongo.open(function (err, db) {
            if (err) {
                return callback(err);
            }
            db.collection("datas", function (err, collection) {
                if (err) {
                    mongo.close();
                    return callback(err);
                }
                collection.remove({
                    name: name,
                }, {
                    w: 1
                }, function (err) {
                    mongo.close();
                    if (err) {
                        return callback(err);
                    }
                    callback(null);
                })
            })
        })
    }
//搜索数据
    Post.search = function (search, callback) {
        mongo.open(function (err, db) {
            if (err) {
                return callback(err);
            }
            db.collection("datas", function (err, collection) {
                if (err) {
                    mongo.close();
                    return callback(err)
                }
                var newRegex = new RegExp(search, "i");
                collection.find({
                    "name": newRegex
                }, {
                    "name": 1,
                    "username": 1,
                    "phone": 1,
                    "email": 1,
                    "time": 1
                }).sort({time: -1}).toArray(function (err, data) {
                    mongo.close();
                    if (err) {
                        return callback(err);
                    }
                    console.log(data);
                    callback(null, data);
                })
            })
        })
    }
}
module.exports = Post;
