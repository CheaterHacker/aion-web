import { Injectable }    from '@angular/core';
import { Headers, Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { Char } from './char';
import { Product } from './product';
import { RequestService } from '../services/request/request.service';

@Injectable()
export class CharService {

	constructor(private http: Http, private requestService: RequestService) { }

	getChars(): Promise<Char[]> {
    let url = 'http://host5/data/mychars';
    let headers = this.requestService.getAuthHeaders();
	  return this.http.get(url, {headers: headers})
	           .toPromise()
	           .then(response => response.json())
	           .catch(this.handleError);
	}

	getChar(id: number) {
	return this.getChars()
	           .then(chars => chars.filter(char => char.id === id)[0]);
	}

  getProducts(): Promise<Product[]> {
    let url = 'http://host5/pay-shop';
    let headers = this.requestService.getAuthHeaders();
    return this.http.get(url, {headers: headers})
             .toPromise()
             .then(response => response.json())
             .catch(this.handleError);
  }

  byItem(id:number, charId:number, count:number = 1) {
    let url = 'http://host5/data/buyitem';
    let headers = this.requestService.getAuthHeaders();
    let item = {'id': id, 'charId':charId, 'count':count};
    return this.http
      .post(url, JSON.stringify(item), {headers: headers})
      .toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }

  private handleError(error: any) {
  	let errMsg = 'An error occurred. ';
    let messages = error.json();
    errMsg += (error.message) ? error.message : error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    if(messages) {
      for (let i = 0, len = messages.length; i<len; i++) {
        errMsg +=' <br> ' + messages[i].message;
      }
    }
    console.error('An error occurred', error);
    return Promise.reject(errMsg);
  }

}