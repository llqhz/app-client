// pages/theme/theme.js
const app = getApp();
var currentApp = {};

// 引入文件
import { Theme } from 'theme-model.js';
var theme = new Theme();  // model


Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    name: '',
    themeInfo: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    currentApp = this;
    theme.setApp(currentApp);
    this.data.id = options.id;
    this.data.name = options.name;
    
    this._loadData();
  },

  onReady: function(){
    // 导航栏初始化完成后设置标题
    theme.setTitle(this.data.name);
  },

  _loadData: function(){
    theme.getProductData(this.data.id);
    console.log(this.data)
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
    jumpToProduct: (data, e) => {
      //console.log(data)
      wx.navigateTo({
        url: '../product/product?id=' + data.id,
      })
    },
    jumpToTheme: (data, e) => {
      wx.navigateTo({
        url: '../theme/theme?id=' + data.id + '&name=' + data.name,
      })
    }
  }


})