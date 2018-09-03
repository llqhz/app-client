import { llwx } from '../../utils/llwx.js';
import { Model } from '../base/model.js';


class Cart extends Model {
    // { 'id','name','main_img_url','price' }
  list = []; 
  cartStoreKey = 'cart';


  constructor(){
    super()
  }


  // 判断商品是否存在,存在则+count,不存在则添加商品数量
  addCart(item, count) {
    var cart = this.getCart();
    var pIndex = this._isHasOne(item.id, cart);
    if ( pIndex === false ) {
      // 添加商品
      item.count = count;
      item.selectStatus = true;
      cart.push(item);
    } else {
      // 增加数量
      cart[pIndex].count += count;
    }
    this.setCart(cart)
  }


  // 从缓存中获取购物车
  // 是否仅返回选中的商品
  getCart(flag) {
    var cart = wx.getStorageSync(this.cartStoreKey);
    if ( !cart ) {
      cart = [];
    }
    if ( flag ) {
      for ( var i=0; i<cart.length; i++ ) {
        if (!cart[i].selectStatus) {
          cart.splice(i,1)
        }
      }
    } 
    return cart;
  }

  // flag 表示是否仅返回选中的商品
  getCartCount(flag){
    var length = 0;
    var cart = this.getCart();
    for ( var item of cart ) {
      if( flag ) {
        if( item.selectStatus ) {
          length += item.count;
        }
      } else {
        length += item.count;
      }
    }
    return length
  }

  // 设置购物车到缓存中
  setCart(cart){
    wx.setStorageSync(this.cartStoreKey, cart)
  }


  // 根据id判断商品在当前购物车中是否存在
  _isHasOne(id, cart){
    var pIndex = false;
    cart.forEach((item,index)=>{
      if (id == item.id ) {
        pIndex = index;
      }
    });
    return pIndex;
  }

  // 根据商品Id获取商品下标
  getProductIndexById(id){
    var carts = this.getCart();
    var pIndex = -1;
    carts.forEach(function(item,index){
      if(item.id == id) {
        pIndex = index
      }
    });
    return pIndex;
  }

  // 计算金额和数量
  getCountAddMoney(cart) {
    var totalCount = 0, typeCount = 0, money = 0;
    let mp = 100; // 使用整数计算
    for (var li of cart) {
      totalCount += li.count;
      typeCount++;
      money += mp * Number(li.price) * li.count;
    }
    return {
      totalCount: totalCount,
      typeCount: typeCount,
      money: money / mp
    }
  }

  // 计算数量和总价
  resetCartData(){
    
  }



}

export { Cart }