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
   * 加载一次执行 
   */
  onLoad: function (options) {
    currentApp = this;
    cart.setApp(currentApp);
    this._loadData();
  },

  _loadData: function(){
    
  },


  /**
   * 每次显示都执行
   */
  onShow: function(){
    
  }

  
  
})