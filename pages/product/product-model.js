// 模型层
import { Model } from '../base/model.js'
import { llwx } from '../../utils/llwx.js'

class Product extends Model {
  constructor(){
    super()
  }

  // 加载商品详情
  getDetail(id){
    return llwx.pajax({
        url: 'product/'+id,
        method: 'get'
      }).then(res=>{
        this.app.setData({
          product: res
        })
      },
        err=>{

      });
  }

  setCount(index){
    var count = this.app.data.countsArr[index];
    this.app.setData({
      countVal: count
    })
  }

  setTab(index){
    this.app.setData({
      currentTabIndex: index
    });
  }

}


export { Product }