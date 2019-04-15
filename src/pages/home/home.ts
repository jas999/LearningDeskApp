import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { ContentProvider } from '../../providers/content/content';
import { File } from '@ionic-native/file';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player';
import { FileOpener } from '@ionic-native/file-opener';
import { AuthProvider } from '../../providers/auth/auth';
import { User } from '../../models/user.models';
/**
 * Generated class for the HomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  content:Array<any> = [];
  public user: User;
  private fileTransfer: FileTransferObject; 
  
    constructor(public navCtrl: NavController, public navParams: NavParams,
       public contentProvider: ContentProvider,private transfer: FileTransfer, 
       private file: File,private androidPermissions: AndroidPermissions,
       private youtube: YoutubeVideoPlayer, private fileOpener: FileOpener,public events: Events,
       public authProvider: AuthProvider ) {


        
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
    
  }

  ionViewWillEnter() {
   this.loadAllContent();
    this.authProvider.getUserProfile(resp=>{
      this.user = resp;
      this.events.publish('UserInfo:generated', this.user);       
    },error=>{
      
    });
  }

  loadAllContent(){
    this.events.publish('showLoading');
    this.contentProvider.getAllContent(resp =>{
      this.content = resp;
      this.events.publish('dismissLoading');
    },error=>{

    });
  }

  public downloadFileCheckPermssion(fileName, filePath) {  
    //console.log('fileName :: '+fileName);
   // console.log('filePath :: '+filePath);
   this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE).then(
  result =>{ console.log('Has permission?',result.hasPermission);
  this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE);
  if(result.hasPermission){
    this.downloadFile(fileName, filePath);
  }else{
    this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE).then(
      result=> {
      if (!result.hasPermission) {      
            console.log('not have permission');
        } else {
            // continue with downloading/ Accessing operation 
            this.downloadFile(fileName, filePath);
        }
    }).catch(error=>{  console.log('error in request permission :: '+JSON.stringify(error));  });
  }
},
  err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE)
);
} 

public downloadFile(fileName, filePath) {  
  this.events.publish('showLoading');
  console.log('fileName :: '+fileName);
  console.log('filePath :: '+filePath);
  //here encoding path as encodeURI() format.  
  let url = encodeURI(filePath);  
  //here initializing object.  
  this.fileTransfer = this.transfer.create(); 
  // here iam mentioned this line this.file.externalRootDirectory is a native pre-defined file path storage. You can change a file path whatever pre-defined method.  
  this.fileTransfer.download(url, this.file.externalDataDirectory+'Download/' + fileName, true).then((entry) => {  
      //here logging our success downloaded file path in mobile. 
      this.events.publish('dismissLoading');
    //  alert('File downloaded to'+entry.toURL());
      this.fileOpener.open(entry.toURL(), 'application/pdf')
      .then(() => console.log('File is opened'))
      .catch(e => console.log('Error opening file', e));
    
  }, (error) => {  
      //here logging our error its easier to find out what type of error occured.  
    /*  console.log('download failed: error.code :: ' + error.code);
      console.log('download failed: error.http_status :: ' + error.http_status);
      console.log('download failed: error.body :: ' + error.body);
      console.log('download failed: error.exception :: ' + error.exception);*/    
      console.log('download failed: ' + error.toString);  
  });  
} 

openAttachment(content) {
  console.log('isContainsVideo :: ' + content.containsVideo);
  console.log('coverImage :: ' + content.coverImage);
  console.log('documentName :: ' + content.documentName);
  console.log('videoLink :: ' + content.videoLink);
  if (content.containsVideo) {
    //call method for play video 
    this.playYouTubeVideo(content.videoLink);
  } else {
    //call method to open document 
    this.downloadFileCheckPermssion(content.documentName, content.document);
  }
 
}

playYouTubeVideo(videoUrl){
  var videoId = videoUrl.substring(videoUrl.lastIndexOf("/") + 1);
  this.youtube.openVideo(videoId);
}

}
