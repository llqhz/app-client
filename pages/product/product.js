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
    product.getDetail(this.data.id)
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
    addToCart: function(data,e){
      var item = currentApp.data.product;
      var keys = [ 'id','name','main_img_url','price' ];
      var data = {};
      item.forEach(function(li,key){
        if( keys.indexOf(key) >= 0 ) {
          data[key] = li;
        }
      });
      cart.addCart(data, this.data.countVal);
    }
  }


})