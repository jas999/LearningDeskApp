import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, ActionSheetController, ToastController, App } from 'ionic-angular';
import { BookmarkProvider } from '../../providers/bookmark/bookmark';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { FileChooser } from '@ionic-native/file-chooser';
import { FilePath } from '@ionic-native/file-path';
import { Base64 } from '@ionic-native/base64';
import { TabPage } from '../tabs/tab';
import { User } from '../../models/user.models';
import { AuthProvider } from '../../providers/auth/auth';
import { City } from '../../models/city.models';

/**
 * Generated class for the AddItemPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-item',
  templateUrl: 'add-item.html',
})
export class AddItemPage {
  //containsVideo:boolean = true;
  popup_1 = false;
  popup_2 = false;
  bookMarkForm: FormGroup;
  title: any;
  description: any;
  courseAndSubCourse: Array<any> = [];
  subCourses: Array<any> = [];
  videoLink: any;
  containsVideo: any = 'true';
  selected_img: any;
  course_1;
  course_2;
  course_2_name;
  selected_course: any;
  mainCourse;
  docBase64: any;
  documentName: string;
  private cities: Array<City> =[];
  private cityId:any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public app: App
    , public events: Events, private camera: Camera, public toastCtrl: ToastController
    , public bookmarkProvider: BookmarkProvider, public formBuilder: FormBuilder,
    private actionSheetCtrl: ActionSheetController, private fileChooser: FileChooser,
    private filePath: FilePath, private base64: Base64, public auth: AuthProvider) {
    this.bookMarkForm = formBuilder.group({
      title: ['', Validators.compose([Validators.required])],
      description: ['', Validators.compose([Validators.required])],
      containsVideo: ['true', Validators.compose([Validators.required])],
      videoLink: ['', Validators.compose([Validators.required])],
      cityId: ['', Validators.compose([Validators.required])]
    });
    this.title = this.bookMarkForm.controls["title"];
    this.description = this.bookMarkForm.controls["description"];
    this.containsVideo = this.bookMarkForm.controls["containsVideo"];
    this.videoLink = this.bookMarkForm.controls["videoLink"];
    this.cityId = this.bookMarkForm.controls["cityId"];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddItemPage');
    this.loadCourseAndSubCourse();
    this.auth.getCities(resp =>{
      this.cities = resp;
    },err =>{});
  }

  ionViewWillEnter() {

  }
  loadCourseAndSubCourse() {
    this.events.publish('showLoading');
    this.bookmarkProvider.getCourseAndSubCourse(resp => {
      this.courseAndSubCourse = resp;
      this.events.publish('dismissLoading');
      //  console.log("*******courseAndSubCourse****" + JSON.stringify(this.courseAndSubCourse));
    }, err => {
      console.log(err);
    })
  }
  change() {
    this.close()
    this.subCourses = this.courseAndSubCourse.filter(s => s.id == '1');
    // console.log(this.subCourses)

    if (this.subCourses.length > 0) {
      this.course_1 = this.subCourses[0].name;
      this.subCourses = this.subCourses[0].course
    }
  }

  change_sub() {
    this.close();
    for (let y in this.subCourses) {
      if (this.subCourses[y].id == Number(this.course_2)) {
        this.course_2_name = this.subCourses[y].name;
      }
    }
    /* let subCourses = this.subCourses.filter(s => s.name == this.course_2);
    this.course_2 = subCourses; */
  }

  updateSubCourse() {
    this.close();
    this.subCourses = [];
    this.course_2_name = "";
    //this.course_2 = undefined;
    for (let x in this.courseAndSubCourse) {
      if (this.courseAndSubCourse[x].id == Number(this.mainCourse)) {
        this.course_1 = this.courseAndSubCourse[x].name
      }
    }
    this.selected_course = this.courseAndSubCourse.filter(s => s.id == this.mainCourse)[0];

    if (this.selected_course) {
      this.subCourses = this.selected_course.course;
    }
    //this.popup_2_open();
  }
  fileChange(file) {
    // console.log(file)
  }


  add() {
    console.log('docBase64 :: ' + this.docBase64);
    console.log('documentName :: ' + this.documentName);
    this.events.publish('showLoading');
    let user: User = this.auth.getUserFromStroage();
    let userId = user.id;
    let data = {
      "userId":userId,
      "title": this.title.value,
      "description": this.description.value,
      "containsVideo": this.containsVideo.value,
      "videoLink": this.videoLink.value,
      "cityIds": [this.cityId.value],
      "courseGroupId": this.mainCourse,
      "courseId": this.course_2,
      'coverImage': this.selected_img,
      "document": this.docBase64,
      "documentName": this.documentName
    }
    
    this.bookmarkProvider.newBookMark(data, resp => {
      this.bookMarkForm.reset();
      this.selected_img = '';
      this.documentName = '';
      this.course_1 = '';
      this.course_2_name = '';
      this.showToast("Added Book Mark successfully.!!");
      this.events.publish('dismissLoading');
      this.app.getRootNav().setRoot(TabPage, { tabIndex: 0 });
    }, err => {
      this.events.publish('dismissLoading');
    });
  }

  close() {
    this.popup_1 = false;
    this.popup_2 = false;
  }
  popup_1_open() {
    this.popup_1 = true
  }
  popup_2_open() {
    this.popup_2 = true
  }

  video_sectoin() {

  }

  showToast(msg: string) {
    const toast = this.toastCtrl.create({
      message: msg,
      duration: 3000
    });
    toast.present();
  }

  openeditprofile() {

    let actionSheet = this.actionSheetCtrl.create({
      title: 'Option',
      cssClass: 'action-sheets-basic-page',
      buttons: [
        {
          text: 'Take photo',
          role: 'destructive',
          handler: () => {
            const options: CameraOptions = {
              quality: 100,
              targetWidth: 600,
              sourceType: this.camera.PictureSourceType.CAMERA,
              destinationType: this.camera.DestinationType.DATA_URL,
              encodingType: this.camera.EncodingType.JPEG,
              mediaType: this.camera.MediaType.PICTURE
            }
            this.camera.getPicture(options).then((imageData) => {
              // imageData is either a base64 encoded string or a file URI
              // If it's base64 (DATA_URL):
              let base64Image = 'data:image/jpeg;base64,' + imageData;
              this.selected_img = base64Image;
              console.log(base64Image)
            }, (err) => {
              // Handle error
            });

          }
        },
        {
          text: 'Choose photo from Gallery',
          handler: () => {
            const options: CameraOptions = {
              quality: 100,
              sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
              destinationType: this.camera.DestinationType.DATA_URL,
              encodingType: this.camera.EncodingType.JPEG,
              mediaType: this.camera.MediaType.PICTURE
            }
            this.camera.getPicture(options).then((imageData) => {
              // imageData is either a base64 encoded string or a file URI
              // If it's base64 (DATA_URL):
              let base64Image = 'data:image/jpeg;base64,' + imageData;
              this.selected_img = base64Image;
            }, (err) => {
              // Handle error
            });
          }
        },
      ]
    });
    actionSheet.present();
  }

  selectFile() {
    // choose your file from the device
    this.fileChooser.open().then(uri => {
      console.log('uri' + JSON.stringify(uri));
      // get file path
      this.filePath.resolveNativePath(uri)
        .then(file => {
          console.log('file' + JSON.stringify(file));
          let filePath: string = file;
          this.documentName = file.substring(file.lastIndexOf("/") + 1);
          // this.documentName="schema.pdf"; // need to fetch from file path
          console.log(' this.documentName :: ' + this.documentName);
          if (filePath) {
            // convert your file in base64 format
            this.base64.encodeFile(filePath)
              .then((base64File: string) => {
                console.log('base64File' + JSON.stringify(base64File));
                this.docBase64 = base64File;
              }, (err) => {
                console.log('err' + JSON.stringify(err));
              });
          }
        })
        .catch(err => console.log(err));
    })
      .catch(e => alert('uri' + JSON.stringify(e)));
  }
}
