// pages/order/order.js
import { Order } from 'order-model.js';
import { Cart } from '../cart/cart-model.js';

const app = getApp()
var currentApp = {};
var order = new Order();
var cart = new Cart();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    products : [],   // 订单包含的商品
    selectedMoney: 0, // 订单总金额
    orderStatus: 0,
    address: {},   // 收货地址
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    currentApp = this;   // 不加 var
    console.log(currentApp)
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
            mobile: res. telNumber
          };
          this.setData({address:addressInfo})
        }
      })
    }
  }

})