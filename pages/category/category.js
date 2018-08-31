// pages/category/category.js
import { Category } from 'category-model.js'

const app = getApp();
var currentApp = {};
var category = new Category();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    categories:[],
    category:{
      products:[],
      info:{}
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    currentApp = this;
    category.setApp(currentApp);
    this._loadData();
  },

  _loadData: function(){
    category.getAllCategories().then(
      res => {
        if (this.data.categories[0]) {
          this.setCategory(0)
        }
      }
    )
  },

  // 根据index索引,组装category数据
  setCategory: function(index){
    category.setCategoryInfo(index);
    var id = category.getCategoryIdByIndex(index);
    category.getProducts(id);
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
    
    // 跳转到商品
    jumpToProduct: (data, e) => {
      wx.navigateTo({
        url: '../product/product?id=' + data.id,
      })
    },

    // 改变分类
    changeCategory: (data, e) => {
      currentApp.setCategory(data.index)
    }

  }

  
})