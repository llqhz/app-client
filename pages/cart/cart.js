// pages/cart/cart.js
import { Cart } from 'cart-model.js'

const app = getApp();
var currentApp = {};
var cart = new Cart();


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
    currentApp = this;
    cart.setApp(currentApp);
    this._loadData();
  },

  _loadData: function(){
    
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  
  
})