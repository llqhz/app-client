/* model 层 */
/* 每一个文件都是一个类 */
// 每一个文件都需要require才能使用

import { llwx } from '../../utils/llwx.js';
import { Model } from '../base/model.js';


class Home extends Model {

  constructor (){
    super()
  }

  getBannerData(id) {
    llwx.pajax({
      url: 'banner/' + id,
      method: 'get',
    }).then(res => {
      this.app.setData({'bannerSwiper':res.items});
    },
      err => {

    });
  }

  getThemeData () {
    llwx.pajax({
      url: 'theme?ids=1,2,3',
      method: 'get',
    }).then(res => {
      this.app.setData({ 'themeList': res });
    },
      err => {

    });
  }

  getProductsData() {
    llwx.pajax({
      url: 'product/recent',
      method: 'get',
    }).then(res => {
      this.app.setData({ 'productList': res });
    },
      err => {

    });
  }
}

export { Home };
