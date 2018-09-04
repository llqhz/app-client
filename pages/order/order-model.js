import { llwx } from '../../utils/llwx.js';
import { Model } from '../base/model.js';


class Order extends Model {
  constructor(){
    super()
  }



  test(){
    console.log('test ----------')
    var a = llwx.Token.getTokenFromServer();
  }


}



export { Order }

