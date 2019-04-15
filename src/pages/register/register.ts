import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, ToastController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { City } from '../../models/city.models';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { TabPage } from '../tabs/tab';
import { User } from '../../models/user.models';


/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {
  selectedGender:boolean=true;
  selected_gender_int:number=1;
  gender_text = "Female";
  registerForm: FormGroup;
  private cities: Array<City> =[];
  private firstname:any;
  private lastname:any;
  private age:any;
  private mobileNumber:any;
  private emailId:any;
  private cityId:any;
  private gender:any;
  constructor(public navCtrl: NavController, public navParams: NavParams
    , public auth: AuthProvider,public formBuilder: FormBuilder,public events: Events,public toastCtrl: ToastController) {

    this.registerForm = formBuilder.group({
      firstname: ['', Validators.compose([Validators.required])],
      lastname: ['', Validators.compose([Validators.required])],
      age: ['', Validators.compose([Validators.required])],
      //gender: [false, Validators.compose([Validators.required])],
      mobileNumber: ['', Validators.compose([Validators.required])],
      emailId: ['', Validators.compose([Validators.required])],
      cityId: ['', Validators.compose([Validators.required])]
      
    });
    this.firstname = this.registerForm.controls["firstname"];
    this.lastname = this.registerForm.controls["lastname"];
    this.age = this.registerForm.controls["age"];
    this.mobileNumber = this.registerForm.controls["mobileNumber"];
    this.emailId = this.registerForm.controls["emailId"];
    this.cityId = this.registerForm.controls["cityId"];
    //this.gender = this.registerForm.controls["gender"];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
    this.auth.getCities(resp =>{
      this.cities = resp;
    },err =>{});
  }
  change() {
    this.selectedGender = !this.selectedGender;
    if(this.selectedGender == false){
      this.gender_text = "Male";
      this.selected_gender_int = 0;
    }else{
      this.gender_text = "Female";
      this.selected_gender_int = 1;
    } 
  }

  add(){
    this.events.publish('showLoading');

    let data = {
      "firstname": this.firstname.value,
      "lastname": this.lastname.value,
      "age": this.age.value,
      "mobileNumber": this.mobileNumber.value,
      "cityId": this.cityId.value,
      "emailId": this.emailId.value,
      'gender': this.selected_gender_int
    };
    this.auth.addUser(data, resp => {
      this.registerForm.reset();
      let user:User = resp;
      this.auth.addUserInStroage(user);
      this.events.publish('dismissLoading');
      this.showToast("You are registered successfully. Please Login In.");
      this.navCtrl.setRoot("LoginPage");          
    }, err => {
      this.events.publish('dismissLoading');
      this.showToast("Email already exist.!!");
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
