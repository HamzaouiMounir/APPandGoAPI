import { Restangular } from 'ng2-restangular';
import { Observable } from 'rxjs/Rx';
import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the APIService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class APIService extends Restangular{
  //Restangular Configuration 
  static RestangularConfigFactory (RestangularProvider) {

  RestangularProvider.setBaseUrl('http://192.168.1.1:3000/api/');
  RestangularProvider.setDefaultHeaders({'Content-Type': 'application/json'});
  // This function must return observable
  var refreshAccesstoken = function () {
    // Here you can make action before repeated request
    return Observable.of(true)
  };
  /**
   * The errorInterceptor is called whenever there's an error. 
   * It's a function that receives the response, subject and the Restangular-response handler as parameters.
   */
  RestangularProvider.addErrorInterceptor((response, subject, responseHandler) => {
    if (response.status === 403) {

      refreshAccesstoken()
      .switchMap(refreshAccesstokenResponse => {
        //If you want to change request or make with it some actions and give the request to the repeatRequest func.
        //Or you can live it empty and request will be the same.
        return response.repeatRequest(response.request);
      })
      .subscribe(
        res => responseHandler(res),
        err => subject.error(err)
      );

      return false; // error handled
    }
    return true; // error not handled
  });
  RestangularProvider.addFullRequestInterceptor((element, operation, path, url, headers, params)=> {
   return {
     params: Object.assign({}, params, {sort:"name"}),
     headers: headers,
     element: element
   }
  });
  RestangularProvider.addResponseInterceptor((data, operation, what, url, response)=> {
       return data;
     });


        
  
}

}
