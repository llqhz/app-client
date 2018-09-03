import { Model } from '../base/model.js';

class Address extends Model {
  constructor(){
    super()
  }

  setAddress(info){
    var province = info.provinceName || info.province,
        city = info.cityName || info.city,
        country = info.countryName || info.country,
        detail = info.detailInfo || detail;
    var totalDetail = city + country + detail; 

  }

  // 是否是直辖市
  isCenterCity(name){
    var cities = ['北京市','天津市','上海市','重庆市'],
      flag = cities.indexOf(name) >= 0;
    return flag
  }

}



export { Address }