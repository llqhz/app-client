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

  getSelectedCart(cart){
    var carts = [];
    for (var item of cart) {
      if (item.selectStatus) {
        carts.push(item)
      }
    }
    return carts;
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
      if( !li.selectStatus ) continue;
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

  // 更新价格到视图
  setPriceToAppData(scar){
    this.app.setData({
      selectedTotalCount: scar.totalCount,
      selectedTypeCount: scar.typeCount,
      selectedMoney: scar.money,
    })
  }


  // 计算数量和总价,更新到视图
  resetCartData(){
    var carts = this.getCart();  // 所有商品
    //var selectedCount = cart.getCount(true);  // 选中商品数量
    var selectedCart = this.getCart(true); // 已经选择的商品
    var scar = this.getCountAddMoney(selectedCart)
    this.app.setData({
      selectedTotalCount: scar.totalCount,
      selectedTypeCount: scar.typeCount,
      selectedMoney: scar.money,
      carts: carts
    })
  }

  // 商品数量增减
  changeCount(id,fun) {
    var cart = this.app.data.carts;
    var index = this.getProductIndexById(id);
    if ( fun == 'incr' ) {
      cart[index].count++;
    } else {
      if (cart[index].count == 1 ) {
        console.log('商品购买数量只能为正整数')
        return;
      }
      cart[index].count--;
    }
    this.app.setData({carts:cart})
    this.setCart(cart);
  }

  // 删除单个商品
  deleteOne(id){
    var cart = this.app.data.carts;
    var index = this.getProductIndexById(id);
    cart.splice(index,1)
    this.app.setData({ carts: cart })
    this.setCart(cart);
  }



}

export { Cart }