import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { City } from '../../models/city.models';
import { User } from '../../models/user.models';

/*
  Generated class for the AuthProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthProvider {

  private baseURL: string = "http://ec2-18-216-28-13.us-east-2.compute.amazonaws.com:8080/LD/";
  constructor(public http: HttpClient) {
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

  async getCities(onSuccess, onError) {
    let userId = null;//await this.storage.get("v_access_token");
    let header = this.getHeader('0');
    let url = this.baseURL + "city/all";
    this.http
      .get(url, { headers: header })
      .subscribe(data => {
        onSuccess(data);
      }, e => {
        this.globalError();
        onError(e);
      });
  }

  async addUser(data: any, onSuccess, onError) {
    let url = this.baseURL + "user/add";
    let userId:string = '0';//await this.storage.get("v_access_token");
    let header = this.getHeader(userId);
    this.http
      .post(url, JSON.stringify(data), { headers: header })
      .subscribe(data => {
        onSuccess(data);
      }, e => {
        this.globalError();
        onError(e);
      });
  } 

  async addUserSocial(data: any, onSuccess, onError) {
    let url = this.baseURL + "user/add";
    let userId:string = '0';//await this.storage.get("v_access_token");
    let header = this.getHeader(userId);
    this.http
      .post(url, JSON.stringify(data), { headers: header })
      .subscribe(data => {
        console.log('in addUserSocial sucess ');
        onSuccess(data);
      }, e =>(function (response)  {
        console.log('in addUserSocial error response '+response);
        this.globalError();
        onError(e,response);
      }));
  } 

  addUserInStroage(user: User){
    window.localStorage.clear();
    window.localStorage.setItem('user', JSON.stringify(user));
  }

  getUserFromStroage(){
    let user: User = JSON.parse(window.localStorage.getItem('user'));
    return user;
  }

  removeUserFromStroage(){
    window.localStorage.clear();
  }

  getUserProfile(onSuccess, onError) {
    let user: User = this.getUserFromStroage();
    let userId = user.id;
    let header = this.getHeader(userId);
    console.log(JSON.stringify(header));
    let url = this.baseURL + "user/get/"+userId;
    this.http
      .get(url, { headers: header })
      .subscribe(data => {
        onSuccess(data);
      }, e => {
        this.globalError();
        onError(e);
      });
  }

  updateUserProfile(data: any, onSuccess, onError){
    let url = this.baseURL + "user/updateprofile";
    let user: User = this.getUserFromStroage();
    let userId = user.id;
    let header = this.getHeader(userId);
    this.http
      .post(url, JSON.stringify(data), { headers: header })
      .subscribe(data => {
        onSuccess(data);
      }, e => {
        this.globalError();
        onError(e);
      });
  }
  
  login(data: any, onSuccess, onError){
    let url = this.baseURL + "user/login";
    let userId:string = '0';//await this.storage.get("v_access_token");
    let header = this.getHeader(userId);
    this.http
      .post(url, JSON.stringify(data), { headers: header })
      .subscribe(data => {
        onSuccess(data);
      }, e => {
        this.globalError();
        onError(e);
      });
  }

  forgotPassword(data: any, onSuccess, onError){
    let url = this.baseURL + "user/forgotpassword";
    let userId:string = '0';//await this.storage.get("v_access_token");
    let header = this.getHeader(userId);
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
