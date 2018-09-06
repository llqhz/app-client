// pages/product/product.js
import { Product } from './product-model.js';
import { Cart } from '../cart/cart-model.js';

var currentApp = {};
var product = new Product();
var cart = new Cart();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    product:{},
    countsArr: [1,2,3,4,5,6,7,8,9,10],
    countVal:1,
    currentTabIndex:0,
    cartCount: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 从其他页面跳转
    currentApp = this;
    product.setApp(currentApp)

    this.data.id = options.id
    this._loadData()
    
  },

  _loadData: function(){
    product.getDetail(this.data.id).then(res=>{
      wx.setNavigationBarTitle({ title: currentApp.data.product.name })
    });
    this.setData({ cartCount: cart.getCartCount() });

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

  // 处理事件
  eventHandler: {
    // 跳转到购物车
    jumpToCart: (data,e) => {
      wx.switchTab({
        url: '/pages/cart/cart',
      })
    },

    // 商品数量选择
    onPickerChange: (data,e) => {
      var index = e.detail.value;
      product.setCount(index)
    },

    // 商品详情Tab切换
    onTabChange: (data,e)=>{
      product.setTab(data.index)
    },

    // 添加到购物车 
    addToCart: (data,e)=>{
      var item = currentApp.data.product;
      var keys = [ 'id','name','main_img_url','price' ];
      var data = {};
      
      for ( var i in item ) {
        if (keys.indexOf(i) >= 0 ) {
          data[i] = item[i];
        }
      }
      // 通知购物车
      var cdata = currentApp.data;
      cart.addCart(data, cdata.countVal);
      
      // 更新显示
      var newCount = cdata.cartCount + cdata.countVal
      currentApp.setData({ cartCount: newCount })
    }
  }


})