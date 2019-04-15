import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, ToastController } from 'ionic-angular';
import { TabPage } from '../tabs/tab';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { User } from '../../models/user.models';
import { AuthProvider } from '../../providers/auth/auth';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { City } from '../../models/city.models';
import { GooglePlus } from '@ionic-native/google-plus';
import { HttpClient } from '@angular/common/http'


/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  loginForm: FormGroup;
  emailId: any;
  password: any;
  user: User;

  constructor(public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder, public toastCtrl: ToastController
    , public auth: AuthProvider, public events: Events, private fb: Facebook,
    private googlePlus: GooglePlus, private http: HttpClient) {
    this.loginForm = formBuilder.group({
      emailId: ['', Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.required])]
    });

    this.emailId = this.loginForm.controls["emailId"];
    this.password = this.loginForm.controls["password"];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  createAccount() {
    this.navCtrl.push('RegisterPage')
  }
  sigin() {
    this.events.publish('showLoading');

    let data = {
      "emailId": this.emailId.value,
      "password": this.password.value
    };
    this.auth.login(data, resp => {
      this.loginForm.reset();
      let user: User = resp;
      this.auth.addUserInStroage(user);
      this.events.publish('dismissLoading');
      this.showToast("You are logged in successfully.!!");
      this.navCtrl.setRoot(TabPage, { tabIndex: 0 });
    }, err => {
      this.events.publish('dismissLoading');
      this.showToast("Please enter valid Email and Password");
    });
  }
  showToast(msg: string) {
    const toast = this.toastCtrl.create({
      message: msg,
      duration: 3000
    });
    toast.present();
  }

  /*fbLogin(){
      this.fb.login(['public_profile', 'user_friends', 'email'])
    .then((res: FacebookLoginResponse) => 
    {
      console.log('Logged into Facebook!', res.status);
      console.log('Logged into Facebook!', res); 
  
  })
    .catch(e => console.log('Error logging into Facebook', e));
  }*/

  fbLogin() {
    this.fb.login(['email', 'public_profile']).then((response: FacebookLoginResponse) => {
      console.log('Logged into Facebook!', response.status);
      console.log('Logged into Facebook!', response);
      if (response.status === "connected") {
        this.fb.api('me?fields=id,name,gender,first_name,last_name,email,hometown,age_range', []).then(profile => {
          console.log('profile :: ' + profile);
          this.add(profile.first_name, profile.last_name, profile.email, '', profile.id);

          // this.userData = {email: profile['email'], first_name: profile['first_name'], picture: profile['picture_large']['data']['url'], username: profile['name']}
        });
      }
    });
  }

  add(firstName, lastName, email, googleId, facebookId) {
    //  this.events.publish('showLoading');
    console.log('firstName :: ' + firstName + '  lastName   ' + lastName + '  email :: ' + email);
    let data = {
      "firstname": firstName,
      "lastname": lastName,
      "age": 26,
      "mobileNumber": 8740855848,
      "cityId": 1,
      "emailId": email,
      'gender': 0,
      'facebookId': facebookId,
      'googleId': googleId
    };
    this.auth.addUser(data, resp => {
      let user: User = resp;
      this.auth.addUserInStroage(user);
      this.events.publish('dismissLoading');
      this.showToast("You are logged in successfully.!!");
      this.navCtrl.setRoot(TabPage, { tabIndex: 0 });
    }, err => {
      console.log('err :: ' + JSON.stringify(err));
      console.log('err.error :: ' + JSON.stringify(err.error));
      this.events.publish('dismissLoading');
      let user: User = err.error; // to get user object 
      this.auth.addUserInStroage(user);
      //this.events.publish('dismissLoading');
      this.showToast("You are logged in successfully.!!");
      this.navCtrl.setRoot(TabPage, { tabIndex: 0 });
    });
  }

  loginWithGooglePlus() {
    this.googlePlus.login({})
      .then(res => {
        console.log(res);
        console.log('email   :: ' + res.email);
        console.log(' userId :: ' + res.userId);
        console.log('First Name  :: ' + res.familyName);
        console.log(' Last Name ' + res.givenName);

        this.add(res.familyName, res.givenName, res.email, res.userId, '');
        // this.getGoogleUserData(res.accessToken); 

      })
      .catch(err => console.error(err));
  }

  /* getGoogleUserData(accessToken){
     console.log('in getGoogleUserData :: token :: '+accessToken);
     
       this.http.get('https://www.googleapis.com/plus/v1/people/me?access_token='+accessToken).subscribe(data=>{
         console.log('data :: '+data);
        // 
 
     });
   }*/

  fargotPassword() {
    this.navCtrl.push('FargotPasswordPage');
  }

}
