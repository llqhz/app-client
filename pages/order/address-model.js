import { Model } from '../base/model.js';
import { llwx } from '../../utils/llwx.js';

class Address extends Model {
  constructor(){
    super()
  }

  getAddressDetail(info){
    var province = info.provinceName || info.province,
        city = info.cityName || info.city,
        county = info.countyName || info.country,
        detail = info.detailInfo || detail;
    var totalDetail = city + county + detail; 
    if ( !this.isCenterCity(province) ) {
      totalDetail = province + totalDetail;
    }
    return totalDetail;
  }


  // 是否是直辖市
  isCenterCity(name){
    var cities = ['北京市','天津市','上海市','重庆市'],
      flag = cities.indexOf(name) >= 0;
    return flag
  }

  // 处理并提交微信返回的地址
  submitAddress(res){
    var address = this.getSubmitAddress(res);
    llwx.pajax({
      url : 'address',
      method: 'post',
      data: address,
      token: true
    }).then(res=>{
      console.log('is submit return',res)
    },res=>{

    });
  }

  // 处理微信返回的地址
  getSubmitAddress(res) {
    return {
      name: res.userName,
      mobile: res.telNumber,
      province: res.provinceName,
      city: res.cityName,
      country: res.countyName, // 家乡
      detail: res.detailInfo
    }
  }


}



export { Address }