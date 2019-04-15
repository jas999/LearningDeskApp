import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../../models/user.models';
import { AuthProvider } from '../auth/auth';
//import { Storage } from '@ionic/storage';

/*
  Generated class for the BookmarkProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class BookmarkProvider {

  private baseURL: string = "http://ec2-18-216-28-13.us-east-2.compute.amazonaws.com:8080/LD/";
 
 constructor(public http: HttpClient, public auth: AuthProvider) {
    console.log('Hello BookmarkProvider Provider');
  }
  globalError() {
    //this.events.publish("token_expired");
  }

  getHeader(userId?: string, type?: string) {
    let myType = "application/json";
    if (type != null) {
      myType = type;
    }
    if (userId == null) {
      return { 'Content-Type': myType };
    } else {
      return {
        'Content-Type': myType,
        'userId':""+ userId + ""
      };
    }
  }

  async getCourseAndSubCourse(onSuccess, onError) {
    let user: User = this.auth.getUserFromStroage();
    let userId = user.id;
    let header = this.getHeader(userId);
    console.log(JSON.stringify(header));
    let url = this.baseURL + "coursegroup/all";
    this.http
      .get(url, { headers: header })
      .subscribe(data => {
        onSuccess(data);
      }, e => {
        this.globalError();
        onError(e);
      });
  }

  async newBookMark(data: any, onSuccess, onError) {
    let url = this.baseURL + "content/add";
    let user: User = this.auth.getUserFromStroage();
    let userId = user.id;
    let header = this.getHeader(userId);
    console.log(JSON.stringify(header));
    this.http
      .post(url, JSON.stringify(data), { headers: header })
      .subscribe(data => {
        onSuccess(data);
      }, e => {
        this.globalError();
        onError(e);
      });
  }


  async addRemoveBookmark( data: any, onSuccess, onError) {
    let user: User = this.auth.getUserFromStroage();
    let userId = user.id;
    let header = this.getHeader(userId);
    console.log(JSON.stringify(header));
    let url = this.baseURL + "content/property/bookmark";
    this.http
      .post(url, JSON.stringify(data), { headers: header })
      .subscribe(data => {
        onSuccess(data);
      }, e => {
        this.globalError();
        onError(e);
      });
  }

  async addRemoveLike( data: any, onSuccess, onError) {
    let user: User = this.auth.getUserFromStroage();
    let userId = user.id;
    let header = this.getHeader(userId);
    console.log(JSON.stringify(header));
    let url = this.baseURL + "content/property/like";
    this.http
      .post(url, JSON.stringify(data), { headers: header })
      .subscribe(data => {
        onSuccess(data);
      }, e => {
        this.globalError();
        onError(e);
      });
  }

  async saveRating( data: any, onSuccess, onError) {
    let user: User = this.auth.getUserFromStroage();
    let userId = user.id;
    let header = this.getHeader(userId);
    console.log(JSON.stringify(header));
    let url = this.baseURL + "content/rate";
    this.http
      .post(url, JSON.stringify(data), { headers: header })
      .subscribe(data => {
        onSuccess(data);
      }, e => {
        this.globalError();
        onError(e);
      });
  }


}
