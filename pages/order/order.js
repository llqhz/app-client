// pages/order/order.js
import { Order } from 'order-model.js';
import { Cart } from '../cart/cart-model.js';
import { Address } from './address-model.js'

const app = getApp()
var currentApp = {};
var order = new Order();
var cart = new Cart();
var address = new Address();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    products : [],   // 订单包含的商品
    selectedMoney: 0, // 订单总金额
    orderStatus: 0,
    address: null,   // 收货地址
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    currentApp = this;   // 不加 var
    order.setApp(currentApp)
    address.setApp(currentApp)
    var origin = options.from;
    if ( origin == 'cart' ) {
      // 从购物车进入
      var selectedMoney = options.money;
      var carts = cart.getCart(true);
      this.setData({
        products:carts,
        selectedMoney: selectedMoney,
        orderStatus: 0, // 需要付款
      })
    }
    this._loadData();
  },

  _loadData: function(){
    //order.test()
  },

  // 监听事件
  listen: function (e) {
    var data = e.currentTarget.dataset;
    var fun = data.fun;
    if (typeof currentApp.eventHandler[fun] == 'function') {
      currentApp.eventHandler[fun](data, e)
    } else {
      console.log('event not handled :', e)
    }
  },

  // 事件处理
  eventHandler: {
    editAddress: (data,e) => {
      wx.chooseAddress({
        success: (res) => {
          var addressInfo = {
            name: res.userName,
            mobile: res. telNumber,
            totalDetail: address.getAddressDetail(res)
          };  
          // 更新视图
          currentApp.setData({address:addressInfo})
          // 后台保存
          address.submitAddress(res);
        }
      })
    }
  }

})