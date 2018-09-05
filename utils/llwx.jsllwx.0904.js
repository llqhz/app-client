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
  // success(title) success(title,fun) success(title,fun,opt)
  success: function (title, cb, opt) {
    var p = {}, opt = opt || {};
    p.title = title;
    p.icon = 'success';
    if (opt.image) p.image = opt.image;
    if (opt.duration) p.duration = opt.duration;
    p.mask = (typeof opt.mask == 'undefined') ? true : opt.mask;
    if (typeof cb == 'function') p.success = cb;
    if (typeof opt.complete == 'function') p.complete = opt.complete;
    p.fail = res => { console.log('call wx showToast error : ', res) };
    return wx.showToast(p);
  },
  // tip(text) tips(text,fun) tips(text,fun,title) tips(text,confirm,true) tips(content,cb,opt)
  tips: function (content, cb, opt) {
    var p = {}, opt = opt || {};
    p.content = content;
    if (typeof opt == 'string') { opt = { title: opt }; };
    if (typeof opt == 'boolean') { opt = { showCancel: opt, confirm: cb }; cb = null };
    p.showCancel = opt.showCancel || false;
    p.title = opt.title || '温馨提示';
    if (opt.cancelText) p.cancelText = opt.cancelText;
    if (opt.cancelColor) p.cancelColor = opt.cancelColor;
    if (opt.confirmText) p.confirmText = opt.confirmText;
    if (opt.confirmColor) p.confirmColor = opt.confirmColor;
    if (typeof cb == 'function') {
      p.success = cb;
    } else {
      p.success = function (r) {
        if (r.confirm)
          return (typeof opt.confirm == 'function') ? opt.confirm() : false;
        if (typeof opt.cancel == 'function') opt.cancel();
      }
    }
    if (typeof opt.complete == 'function') p.complete = opt.complete;
    p.fail = function (res) { console.log('call wx showModal error : ', res); };
    return wx.showModal(p);
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
      console.log('wxapp ajax error', r);
      typeof opt.fail == 'function' ? opt.fail(r) : 0;
    }
    req.complete = r => typeof opt.complete == 'function' ? opt.complete(r) : 0;
    typeof opt.complete == 'function' ? (req.complete = opt.complete) : 0;
    req.success = r => typeof opt.success == 'function' ? opt.success(r.data, r) : 0;
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
  pajax: function (opt) {
    return new Promise((resolve, reject) => {
      opt.success = (res, r) => resolve(res)
      opt.fail = err => reject(err);
      // return与不return的区别是 是否等待Promise里面的程序执行完
      return new Promise((resolve1, reject1) => {
        if (opt.token == true) {
          return this.Token.verify().then(res => {
            resolve1(res)
          })
        } else {
          resolve1();
        }
      }).then(res => {
        this.ajax(opt);  // 返不返回Promise决定是否异步,
      });
    });
  },
  Token: {
    key: () => Config.tokenKey,
    get() {
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
            }).then((res, rsp) => {
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
        }).then((res, rsp) => {
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