/* model 层 */
/* 每一个文件都是一个类 */
// 每一个文件都需要require才能使用

import { llwx } from '../../utils/llwx.js';
import { Model } from '../base/model.js';

class Theme extends Model {
  constructor() {
    super()
  }

  setTitle(name){
    wx.setNavigationBarTitle({
      title: name,
    })
  }

  getProductData(id) {
    llwx.pajax({
      url: 'theme/'+id,
      method: 'get',
    }).then(res => {
      if (res) {
        this.app.setData({ 'themeInfo': res });
      }
    },
      err => {

      });
  }

}


export { Theme }