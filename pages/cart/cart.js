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
    selectedTotalCount: 0,
    selectedTypeCount: 0,
    selectedMoney: 0
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
    var carts = cart.getCart();  // 所有商品
    //var selectedCount = cart.getCount(true);  // 选中商品数量
    var selectedCart = cart.getCart(true); // 已经选择的商品

    var scar = this.getCountAddMoney(selectedCart)
    this.setData({
      selectedTotalCount: scar.totalCount,
      selectedTypeCount: scar.typeCount,
      selectedMoney: scar.money,
      carts: carts
    })
    console.log(carts)
  },

  // 计算金额和数量
  getCountAddMoney(cart){
    var totalCount = 0, typeCount=0 , money=0;
    let mp = 100; // 使用整数计算
    for( var li of cart ) {
      totalCount+=li.count;
      typeCount++;
      money += mp*Number(li.price) * li.count;
    }
    return { 
      totalCount: totalCount,
      typeCount: typeCount,
      money: money / mp
    }
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
    toggleSelect: (data, e) => {
      var id = data.id;
      var index = cart.getProductIndexById(id);

      // 商品状态选择
      // 通知视图
      var carts = currentApp.data.carts;
      var item = carts[index];
      item.selectStatus = !item.selectStatus;
      currentApp.setData({carts:carts});
      // 通知缓存
      cart.setCart(carts);
    },

    toggleSelectAll: (data,e) => {
      var carts = currentApp.data.carts;
    }
  },




  
  
})