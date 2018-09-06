/*
* @Author: llqhz
* @Date:   2018-07-06 10:01:42
* @Last Modified by:   name
* @Last Modified time: 2018-08-27 16:49:33

// var ll = require('../../utils/com.js'); // 相对路径
  import { ll } from '../../utils/com.js';
  var llwx = require( '../../utils/llwx.js' );
*/

import { Config } from 'config.js';

var llwx = {
  config: {
    host: Config.host,   // 指定请求的host
    header: {   // 指定请求的header
      'content-type': 'application/json',
      'token': 'defalut',
    },
  },
  // 设置配置
  set: function (opt) {
    for (var i in opt) {
      llwx.config[i] = opt[i];
    }
  },
  dialog: {
    success: (msg,cb) => {
      wx.showToast({
        title: msg,
        success: ()=> cb && cb() 
      })
    },
    msg: (msg,cb) => {
      wx.showToast({
        title: msg,
        icon: 'none',
        success: ()=>cb && cb()
      })
    },
    alert: (title,content,cb) => {
      wx.showModal({
        title: title,
        content: content,
        success: function (res) {
          if (res.confirm) {
            cb&&cb(true)
          } else if (res.cancel) {
            cb&&cb(false)
          }
        }
      })
    }
  },
  url: function (url) {
    if (/http/.test(url)) {
      return url;
    }
    return this.config.host + url;
  },
  extend: function (obj1, obj2) {
    if (!obj2) return;
    for (var i in obj2) {
      obj1[i] = obj2[i];
    }
    return obj1;
  },
  ajax: function (opt) {
    if (typeof opt.url == 'undefined') { console.log("ajax url not found ..."); return; };
    var req = { url: this.url(opt.url) };
    req.method = (opt.method || 'POST').toUpperCase();
    req.dataType = opt.dataType || 'json';
    req.responseType = opt.responseType || 'text';
    req.fail = r => {
      console.log('wxapp ajax error',r);
      typeof opt.fail == 'function' ? opt.fail(r) : 0;
    }
    req.complete = r => typeof opt.complete == 'function' ? opt.complete(r) : 0;
    typeof opt.complete == 'function' ? (req.complete = opt.complete) : 0;
    req.success = r => typeof opt.success == 'function' ? opt.success(r.data,r) : 0;
    req.complete = typeof opt.complete == 'function' ? opt.complete : false;
    if (opt.data) { req.data = opt.data; };
    // 加入header  默认+传参
    this.config.header.token = this.Token.get();
    this.extend(this.config.header, opt.header);
    req.header = this.config.header;
    try {
      wx.request(req);
    } catch (e) {
      console.log(e);
    }
  },
  pajax: function(opt){
    return new Promise((resolve,reject)=>{
      // opt.success = (res,r) => resolve(res)
      // opt.fail = err => reject(err);
      // return与不return的区别是 是否等待Promise里面的程序执行完
      new Promise((resolve1,reject1)=>{ 
        if (opt.token == true) {
          opt.success = (res, r) => resolve1(r);  // 此处resolve只能传递一个参数
          opt.fail = err => reject1(err);
        } else {
          opt.success = (res, r) => resolve(res)
          opt.fail = err => reject(err);
        }
        this.ajax(opt)
      }).then(r=>{
        if (r.statusCode == 401 && (!opt.retry)) {
          // token已经过期  aop 思想
          opt.retry = true;
          opt.success = (res, r) => {
            resolve(res)
          }
          opt.fail = err => reject(err);
          // 当前opt.success指向 resolve1, 并且此时已经在resolve1处理后的里面
          return this.Token.getTokenFromServer().then(res => {
            this.pajax(opt).then(
              res=>{
                resolve(res)  // 此处的pajax return不回去,只能调用
              }
            );
          })
        } else {
          resolve(r.data)
        }
      });
    });
  },
  Token: {
    key: () => Config.tokenKey,
    get(){
      return wx.getStorageSync(this.key())
    },
    set(token) { 
      wx.setStorageSync(this.key(), token)
    },
    verify() {
      var token = this.get(); 
      if (!token) {
        return this.getTokenFromServer();
      } else {
        return this.verifyTokenFromServer();
      }
    },
    // 获取Token
    getTokenFromServer() {
      return new Promise((resolve, reject) => {
        // this 指向 llwx.Token  即与 new Promise 同级
        wx.login({
          success: res => {
            // this 指向 llwx.Token
            llwx.pajax({
              url: 'token/user',
              method: 'get',
              data: {
                code: res.code
              }
            }).then((res,rsp) => {
              // this 指向 llwx.Token
              if (res.token) {
                this.set(res.token);
                resolve(res.token);
              } else {
                reject(res)
                console.log('get token error:', res)
              }
            })
          }
        })
      })
    },

    // 验证token并自动更新
    verifyTokenFromServer() {
        return new Promise((resolve, reject) => {
          llwx.pajax({
            url: 'token/user/verify',
            method: 'post',
            data: { token: this.get() }
          }).then((res,rsp) => {
            if (!res.isValid) {
              this.getTokenFromServer().then(res => {
                resolve(res);
              })
            } else {
              resolve(this.get())
            }
          })
        });
      }
  }
};


module.exports = { 
  llwx
};



// module.exports = {
//   baseUrl: baseUrl,
//   url: url
// };

// class 的导出
// export { ll };