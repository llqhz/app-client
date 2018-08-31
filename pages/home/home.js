// pages/home/home.js
/* controller 层 */
const app = getApp();
var currentApp = {};

// 引入文件
import { Home } from 'home-model.js';
var home = new Home();  // model

Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerSwiper : {},
    themeList: {},
    productList: [],
  },

  onLoad: function(){
    currentApp = this;
    home.setApp(this);
    this._loadData();
  },

  _loadData: function() {
    var id = 1;
    home.getBannerData(id);
    home.getThemeData();
    home.getProductsData();
  },

  // 监听事件
  listen: function(e){
    var data = e.currentTarget.dataset;
    var fun = data.fun;
    if (typeof currentApp.eventHandler[fun] == 'function' ) {
      currentApp.eventHandler[fun](data,e)
    } else {
      console.log('event not handled :',e)
    }
  },

  // 处理事件
  eventHandler: {
    jumpToProduct: (data,e) => {
      //console.log(data)
      wx.navigateTo({
        url: '../product/product?id='+data.id,
      })
    },
    jumpToTheme: (data,e)=>{
      wx.navigateTo({
        url: '../theme/theme?id='+data.id+'&name='+data.name,
      })
    }
  }

})