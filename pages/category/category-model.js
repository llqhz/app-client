import {llwx} from '../../utils/llwx.js';
import {Model} from '../base/model.js';

class Category extends Model{
  constructor(){
    super()
  }

  getAllCategories(){
    return llwx.pajax({
      url: 'category/all',
      method: 'get'
    }).then(
      res=>{
        this.app.setData({
          categories:res
        })
    },err=>{

    });
  }

  getCategoryIdByIndex(index){
    if (this.app.data.categories && this.app.data.categories[index] ) {
      return this.app.data.categories[index]['id']
    }
    return null;
  }

  getCategoryIndexById(id){
    if (this.app.categories) {
      var pIndex = null;
      this.app.categories.forEach(function(item,index,arr){
        if (item.id == parseInt(id) ){
          return pIndex;
        }
      })
    }
    return null
  }

  // 设置分类信息
  setCategoryInfo(index){
    // 设置分类详情
    var category = this.app.data.category;
    var data = this.app.data.categories[index];
    category.info = {
      index: index,
      id: data.id,
      name: data.name,
      imgurl: data.img.url
    }
    this.app.setData({category:category})
  }

  getProducts(id){
    llwx.pajax({
      url: 'product/by_category/'+id,
      method: 'get'
    }).then(
      res => {
        var category = this.app.data.category;
        category.products = res
        this.app.setData({ category: category })
      }, err => {

    });
  }



}



export { Category }