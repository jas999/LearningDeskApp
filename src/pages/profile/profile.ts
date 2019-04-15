import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, ToastController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { User } from '../../models/user.models';
import { BookmarkProvider } from '../../providers/bookmark/bookmark';

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  popup_1 = false;
  popup_2 = false;
  public user: User;
  firstname:string;
  lastname:string;
  emailId:string
  courseAndSubCourse: Array<any> = [];
  subCourses: Array<any> = [];
  course_2_name;
  selected_course: any;
  mainCourse;
  course_1;
  course_2
  selectedCourse1IdsArray :any = [];
  selectedCourse2IdsArray :any = [];
  selectedCourse1Array :any = [];
  selectedCourse2Array :any = [];
  private newsletter:boolean = true;
  private notifications:boolean = true;

  constructor(public navCtrl: NavController, public navParams: NavParams, public toastCtrl: ToastController
    , public authProvider: AuthProvider, public events: Events, public bookmarkProvider: BookmarkProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');    
  }

  loadCourseAndSubCourse(){    
    this.bookmarkProvider.getCourseAndSubCourse(resp => {
      this.courseAndSubCourse = resp;
        this.updateCourse1ValueOnPageLoad();
        this.events.publish('dismissLoading');
     }, err => {
      console.log(err);
    })
  }

  ionViewWillEnter(){
    this.getUserProfile();
  }

  updateCourse1ValueOnPageLoad(){
    this.course_1 = undefined;
    let course:any;
    this.subCourses= [];
    this.selectedCourse1Array= [];
    this.selectedCourse1IdsArray = [];
    for (let x in this.courseAndSubCourse) {
      for(course of this.user.courseGroup){

       console.log('this.courseAndSubCourse[x].id  ::  '+this.courseAndSubCourse[x].id);
       console.log('course.id  ::  '+course.id);
       console.log(Number(this.courseAndSubCourse[x].id) == Number(course.id));
           
     if(Number(this.courseAndSubCourse[x].id) == Number(course.id)){
          this.courseAndSubCourse[x].checked = true;
          this.selectedCourse1Array.push(this.courseAndSubCourse[x]);
          this.selectedCourse1IdsArray.push(this.courseAndSubCourse[x].id);          
          this.subCourses.push(...this.courseAndSubCourse[x].course)
          if(this.course_1 == undefined){
            this.course_1 = this.courseAndSubCourse[x].name;
          }else if(!this.course_1.includes(this.courseAndSubCourse[x].name)){
            this.course_1 = this.course_1+ " ," + this.courseAndSubCourse[x].name;
          }
        }
      }  
    }

    console.log('course.id  ::  '+this.selectedCourse1Array);
    console.log('course.id  ::  '+this.selectedCourse1IdsArray);

    this.updateCourse2ValueOnPageLoad();
  }

  updateCourse2ValueOnPageLoad(){
    console.log('updateCourse2ValueOnPageLoad   ::  '+this.selectedCourse2Array);
    console.log('updateCourse2ValueOnPageLoad   ::  '+this.selectedCourse2IdsArray);
    this.selectedCourse2Array= [];
    this.selectedCourse2IdsArray = [];

    this.course_2 = undefined;
    let course:any;
    for (let x in this.subCourses) {
      for(course of this.user.course){
        if(Number(this.subCourses[x].id) == Number(course.id)){
          this.subCourses[x].checked = true;
          this.selectedCourse2Array.push(this.subCourses[x]);
          this.selectedCourse2IdsArray.push(this.subCourses[x].id);
          if(this.course_2 == undefined){
            this.course_2 = this.subCourses[x].name;
          }else if(!this.course_2.includes(this.subCourses[x].name)){
            this.course_2 = this.course_2+ " ," + this.subCourses[x].name;
          }
        }
      }  
    }
    console.log('updateCourse2ValueOnPageLoad after  ::  '+this.selectedCourse2Array);
    console.log('updateCourse2ValueOnPageLoad after  ::  '+this.selectedCourse2IdsArray);

  }

  getUserProfile(){
    this.events.publish('showLoading');
    this.authProvider.getUserProfile(resp=>{
      this.user = resp;
      this.firstname = this.user.firstname;
      this.lastname = this.user.lastname;
      this.emailId = this.user.emailId;
      this.loadCourseAndSubCourse();
      
    },error=>{
      
    });
  }

  change(){
    this.close()
  }

  close() {
    this.popup_1 = false;
    this.popup_2 = false;
  }
  popup_1_open() {
    this.popup_1 = true
  }
  popup_2_open(){
    this.popup_2 = true
  }

  updateSubCourse() {
    this.close();
    this.subCourses = [];
    this.course_2_name = "";
    console.log("*****before******"+JSON.stringify(this.subCourses));

    
    this.updateCourse1Value();
      // Update sub courses
      for (let x in this.courseAndSubCourse) {
        for(let y in this.selectedCourse1Array){
          if(this.courseAndSubCourse[x].id == this.selectedCourse1Array[y].id){
            this.subCourses.push(...this.courseAndSubCourse[x].course)
          } 
        }
      }    
      console.log("*****selected_course******"+JSON.stringify(this.subCourses));
  }

  updateCourse1Value(){
    console.log('calling updateCourse1Value');
    console.log('calling updateCourse1Value ::selectedCourse1Array '+this.selectedCourse1Array);
    this.course_1 = undefined;
    for (let x in this.courseAndSubCourse) {
      for(let y in this.selectedCourse1Array){
        if(this.courseAndSubCourse[x].id == this.selectedCourse1Array[y].id){
          if(this.course_1 == undefined){
            this.course_1 = this.courseAndSubCourse[x].name;
          }else if(!this.course_1.includes(this.courseAndSubCourse[x].name)){
            this.course_1 = this.course_1+ " ," + this.courseAndSubCourse[x].name;
          }
        }
      }
    }
  }

  updateCourse2Value(){
    this.course_2 = undefined;
    for (let x in this.subCourses) {
      for(let y in this.selectedCourse2Array){
        if(this.subCourses[x].id == this.selectedCourse2Array[y].id){
          if(this.course_2 == undefined){
            this.course_2 = this.subCourses[x].name;
          }else if(!this.course_2.includes(this.subCourses[x].name)){
            this.course_2 = this.course_2+ " ," + this.subCourses[x].name;
          }
        }
      }
    }
  }


  change_sub() {
    this.close();
    this.updateCourse2Value();
  }

  selectCourse1(data){

    //this.selectedCourse1Array=[];
    //this.selectedCourse1IdsArray=[];    
    console.log(this.selectedCourse1Array);
    console.log(this.selectedCourse1IdsArray);

    if (data.checked == true) {
       this.selectedCourse1Array.push(data);
       this.selectedCourse1IdsArray.push(data.id);
     } else {
      let newArray = this.selectedCourse1Array.filter(function(el) {
        return el.id !== data.id;
     });
      let newArrayIds = this.selectedCourse1IdsArray.filter(function(el) {
        return el !== data.id;
    });
      this.selectedCourse1Array = newArray;
      this.selectedCourse1IdsArray = newArrayIds;
    }
    console.log(this.selectedCourse1Array);
    console.log(this.selectedCourse1IdsArray);
  }

  selectCourse2(data){
     if (data.checked == true) {
       this.selectedCourse2Array.push(data);
       this.selectedCourse2IdsArray.push(data.id);
     } else {
      let newArray = this.selectedCourse2Array.filter(function(el) {
        return el.id !== data.id;
     });
     let newArrayIds = this.selectedCourse2IdsArray.filter(function(el) {
      return el !== data.id;
   });
      this.selectedCourse2Array = newArray;
      this.selectedCourse2IdsArray = newArrayIds;
    }
    console.log(this.selectedCourse2Array);
    console.log(this.selectedCourse2IdsArray);
  }

  updateProfile(){
    this.events.publish('showLoading');

    let data = {
      "id": this.user.id,
      "courseGroupId": this.selectedCourse1IdsArray,
      "courseId": this.selectedCourse2IdsArray,
      "notifications": this.notifications,
      "newsletter": this.newsletter
    };
    this.authProvider.updateUserProfile(data, resp => {
      let user:User = resp;
      this.authProvider.addUserInStroage(user);
      this.events.publish('dismissLoading');
      this.showToast("Profile is updated successfully.");
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
