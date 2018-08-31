// pages/test/index.js
const app = getApp();

import { llwx } from '../../utils/llwx.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.tapp = this;
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  clickHandler: {
    getToken : e => {
      // 登录
      wx.login({
        success: res => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          llwx.ajax({
            url: 'token/user',
            method: 'get',
            data: {
              code: res.code,
              // XDEBUG_SESSION_START:12325
            },
            success : res => {
              if ( res && res.token ) {
                wx.setStorage({key: 'token',data: res.token,})
              };
            }
          });
        },
        fail: res => {
          console.log(res)
        }
      })
    },
    placeOrder: e => {
      // 订单下单
      llwx.ajax({
        url: 'order/place?XDEBUG_SESSION_START=18361',
        method: 'post',
        data: {
          'products': [
            {product_id: 1, count: 2},
            {product_id: 2, count: 3},
          ],
        },
        success : res => {
          console.log(res)
        }
      });
    },
    createAddress: e => {
      // 订单下单
      llwx.ajax({
        url: 'address?XDEBUG_SESSION_START=18361',
        method: 'post',
        data: {
          'name': '筱怪',
          'mobile': '13297963625',
          "province" : "湖北",
          "city" : "武汉",
          "country" : "中国",
          "detail" : "湖北省武汉市江岸区201号"
        },
        success : res => {
          console.log(res)
        }
      });
    }
  },


  click: (e) => {
    var tapp = app.tapp;
    var fun = e.target.dataset.fun;
    if (typeof tapp.clickHandler[fun] == 'function' ) {
      tapp.clickHandler[fun](e);
    } else {
      console.log('false')
    }
  }

})