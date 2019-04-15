import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,Events,ToastController } from 'ionic-angular';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AuthProvider } from '../../providers/auth/auth';

/**
 * Generated class for the FargotPasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-fargot-password',
  templateUrl: 'fargot-password.html',
})
export class FargotPasswordPage {
  fargotpasswordForm;
  email;
  constructor(public navCtrl: NavController, public navParams: NavParams, 
    public formBuilder: FormBuilder,public authProvider: AuthProvider,
    public events: Events, public toastCtrl: ToastController) {
    this.fargotpasswordForm = formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.email])]
    });
    this.email = this.fargotpasswordForm.controls["email"];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FargotPasswordPage');
  }

  forgotPassword(){
    this.events.publish('showLoading');
    console.log('this.email :: '+this.email.value);
    let data={"emailId":this.email.value};
    this.authProvider.forgotPassword(data, resp => {
      console.log('resp :: '+resp);   
      this.events.publish('dismissLoading');
     // this.navCtrl.push('FargotPasswordPage');
     this.showToast("New Password has been sent to your Email Id.!!");
      this.navCtrl.setRoot("LoginPage");
    }, err => {
      this.events.publish('dismissLoading');
    }); 
  }

  showToast(msg: string) {
    const toast = this.toastCtrl.create({
      message: msg,
      duration: 3000
    });
    toast.present();
  }

}
