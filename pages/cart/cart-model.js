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
  getCart() {
    var cart = wx.getStorageSync(this.cartStoreKey);
    if ( !cart ) {
      cart = [];
    }
    return cart;
  }

  getCartCount(){
    var length = 0;
    var cart = this.getCart();
    for ( var item of cart ) {
      length += item.count;
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

}

export { Cart }