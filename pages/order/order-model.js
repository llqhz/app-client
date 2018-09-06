import { llwx } from '../../utils/llwx.js';
import { Model } from '../base/model.js';

class Order extends Model {
  keyname = 'newOrder';  // 订单状态保存键
  setNewOrderStatus(status){
    wx.setStorageSync(this.keyname, status)
  }

  getNewOrderStatus(){
    return wx.getStorageSync(this.keyname)
  }

  constructor(){
    super()
  }


  getPayProducts(){
    var list = this.app.data.products;
    var products = [];
    for ( var li of list ) {
      var product = {
        product_id: li.id,
        count: li.count
      };
      products.push(product);
    }
    return products;
  }

  firstTimePay(){
    var products = this.getPayProducts();
    this.doOrder(products)
  }

  doOrder(products){
    return llwx.pajax({
      url: 'order/place',
      method: 'post',
      token: true,
      data:{products:products}
    }).then(res=>{
      if(res.pass) { // 订单生成成功
        // 更新订单状态
        this.app.setData({
          id:res.order_id,
          //fromCartFlag : false
        });
        this.setNewOrderStatus(true)
        // 开始支付
        this.execPay(res.order_id).then(res=>{
          this.deleteProducts();
          wx.navigateTo({
            url: '../pay-result/pay-result?id='+id+'&flag=2$from=order'
          })
        },err=>{
          // 支付失败
          llwx.dialog.msg(err.msg)
        })
      } else {
        // 下单失败
        llwx.dialog.msg('下单失败')
      }
    })
  }

  moreTimePay(){

  }

  /**
   * order_id 订单id
   */
  execPay(order_id){
    return llwx.pajax({
      url: 'pay/pre_order/' + order_id,
      method: 'get',
    }).then(res=>{
      return new Promise((resolve,reject)=>{
        if (res && res.timeStamp) {
          wx.requestPayment({
            timeStamp: res.timeStamp,
            nonceStr: res.nonceStr,
            package: res.package,
            signType: res.signType,
            paySign: res.paySign,
            success: res => resolve(res),
            fail: res=>reject({msg:'取消支付'}),
          })
        } else {
          reject(res);
        }
      })
    })
  }


}



export { Order }

