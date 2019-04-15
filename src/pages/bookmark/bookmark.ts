import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, ToastController } from 'ionic-angular';
import { ContentProvider } from '../../providers/content/content';
import { File } from '@ionic-native/file';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player';
import { FileOpener } from '@ionic-native/file-opener';
import { BookmarkProvider } from '../../providers/bookmark/bookmark';
/**
 * Generated class for the BookmarkPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-bookmark',
  templateUrl: 'bookmark.html',
})
export class BookmarkPage {

  content:Array<any> = [];
  private fileTransfer: FileTransferObject; 

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public contentProvider: ContentProvider,private transfer: FileTransfer, 
    private file: File,private androidPermissions: AndroidPermissions,
    private youtube: YoutubeVideoPlayer, private fileOpener: FileOpener,public events: Events,
    public bookmarkProvider: BookmarkProvider,public toastCtrl: ToastController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ListPage');
  }

  ionViewWillEnter() {
    this.loadAllContent();
   }
 
   loadAllContent(){
    this.events.publish('showLoading');
     this.contentProvider.getAllContent(resp =>{
       this.content = resp;
       this.events.publish('dismissLoading');
      // console.log('this.content :: '+this.content);
     },error=>{
 
     });
   }

   openAttachment(content){
    if(content.containsVideo){
      //call method for play video 
      this.playYouTubeVideo(content.videoLink);

    }else{
      //call method to open document 
      this.downloadFileCheckPermssion(content.documentName,content.document);
    }
      console.log('isContainsVideo :: '+content.containsVideo);
      console.log('coverImage :: '+content.coverImage);
      console.log('documentName :: '+content.documentName);
      console.log('videoLink :: '+content.videoLink);

   }

   public downloadFileCheckPermssion(fileName, filePath) {  
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
     // alert('File downloaded to'+entry.toURL());
      this.fileOpener.open(entry.toURL(), 'application/pdf')
      .then(() => console.log('File is opened'))
      .catch(e => console.log('Error opening file', e));
    
  }, (error) => {      
      console.log('download failed: ' + error.toString);  
  });  
} 

playYouTubeVideo(videoUrl){
  var videoId = videoUrl.substring(videoUrl.lastIndexOf("/") + 1);
  this.youtube.openVideo(videoId);
}

addRemoveBookmark(id,userId,isBookmark) {
    console.log('content id :: '+id);
    this.events.publish('showLoading');
    if(isBookmark==null || isBookmark==undefined)
      isBookmark=false;

      console.log('userId :: '+userId);
      console.log('isBookmark :: '+isBookmark);
      
    let data ={
      "contentId" : id,
      "userId" : userId,
      "bookmark" : !isBookmark
      };   
      this.bookmarkProvider.addRemoveBookmark(data, resp => {
        console.log('resp :: '+resp);   
        this.events.publish('dismissLoading');  
        if(isBookmark)
            this.showToast("Content Bookmark removed successfully.!!"); 
         else
           this.showToast("Content Bookmark added successfully.!!"); 

        this.loadAllContent();  
      }, err => {
        this.events.publish('dismissLoading');
      });      
  }


  addRemoveLike(id,userId,isLiked) {
    console.log('content id :: '+id);
    this.events.publish('showLoading');
    if(isLiked==null || isLiked==undefined)
        isLiked=false;      
      console.log('userId :: '+userId);
      console.log('isLiked :: '+isLiked);

    let data ={
      "contentId" : id,
      "userId" : userId,
      "liked" : !isLiked
      };   
      this.bookmarkProvider.addRemoveLike(data, resp => {
        console.log('resp :: '+resp); 
        this.events.publish('dismissLoading');

         if(isLiked)
            this.showToast("Favourite removed successfully.!!"); 
         else
           this.showToast("Favourite added successfully.!!");  

        this.loadAllContent();  
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
