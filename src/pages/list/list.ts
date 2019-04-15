import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, ToastController, AlertController } from 'ionic-angular';
import { ContentProvider } from '../../providers/content/content';
import { File } from '@ionic-native/file';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player';
import { FileOpener } from '@ionic-native/file-opener';
import { BookmarkProvider } from '../../providers/bookmark/bookmark';
import { SocialSharing } from '@ionic-native/social-sharing';
import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the ListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-list',
  templateUrl: 'list.html',
})
@Pipe({
  name: 'limitTo'
})


export class ListPage {
  content: Array<any> = [];
  private fileTransfer: FileTransferObject;
  popupActive;
  rating:Number=0;
  rateContentId;
  userId;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public contentProvider: ContentProvider, private transfer: FileTransfer,
    private file: File, private androidPermissions: AndroidPermissions,
    private youtube: YoutubeVideoPlayer, private fileOpener: FileOpener, public events: Events, private alertCtrl: AlertController,
    public bookmarkProvider: BookmarkProvider, public toastCtrl: ToastController, private socialSharing: SocialSharing) {

      events.subscribe('star-rating:changed', (starRating) => {
        
        console.log(starRating);
        this.rating=starRating;
      
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ListPage');
  }

  ionViewWillEnter() {
    this.loadAllContent();
  }

  loadAllContent() {
    this.events.publish('showLoading');
    this.contentProvider.getAllContent(resp => {
      this.content = resp;
      // console.log('this.content :: '+this.content);
      this.events.publish('dismissLoading');

    }, error => {

    });
  }

  openAttachment(content) {
    if (content.containsVideo) {
      //call method for play video 
      this.playYouTubeVideo(content.videoLink);

    } else {
      //call method to open document 
      this.downloadFileCheckPermssion(content.documentName, content.document);
    }
    console.log('isContainsVideo :: ' + content.containsVideo);
    console.log('coverImage :: ' + content.coverImage);
    console.log('documentName :: ' + content.documentName);
    console.log('videoLink :: ' + content.videoLink);
  }

  public downloadFileCheckPermssion(fileName, filePath) {
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE).then(
      result => {
        console.log('Has permission?', result.hasPermission);
        this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE);
        if (result.hasPermission) {
          this.downloadFile(fileName, filePath);
        } else {
          this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE).then(
            result => {
              if (!result.hasPermission) {
                console.log('not have permission');
              } else {
                // continue with downloading/ Accessing operation 
                this.downloadFile(fileName, filePath);
              }
            }).catch(error => { console.log('error in request permission :: ' + JSON.stringify(error)); });
        }
      },
      err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE)
    );
  }

  public downloadFile(fileName, filePath) {
    this.events.publish('showLoading');
    console.log('fileName :: ' + fileName);
    console.log('filePath :: ' + filePath);
    //here encoding path as encodeURI() format.  
    let url = encodeURI(filePath);
    //here initializing object.  
    this.fileTransfer = this.transfer.create();
    // here iam mentioned this line this.file.externalRootDirectory is a native pre-defined file path storage. You can change a file path whatever pre-defined method.  
    this.fileTransfer.download(url, this.file.externalDataDirectory + 'Download/' + fileName, true).then((entry) => {
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

  playYouTubeVideo(videoUrl) {
    var videoId = videoUrl.substring(videoUrl.lastIndexOf("/") + 1);
    this.youtube.openVideo(videoId);
  }

  addRemoveBookmark(id, userId, isBookmark) {
    console.log('content id :: ' + id);
    this.events.publish('showLoading');
    if (isBookmark == null || isBookmark == undefined)
      isBookmark = false;

    console.log('userId :: ' + userId);
    console.log('isBookmark :: ' + isBookmark);

    let data = {
      "contentId": id,
      "userId": userId,
      "bookmark": !isBookmark
    };
    this.bookmarkProvider.addRemoveBookmark(data, resp => {
      console.log('resp :: ' + resp);
      this.events.publish('dismissLoading');
      if (isBookmark)
        this.showToast("Content Bookmark removed successfully.!!");
      else
        this.showToast("Content Bookmark added successfully.!!");

      this.loadAllContent();
    }, err => {
      this.events.publish('dismissLoading');
    });
  }


  addRemoveLike(id, userId, isLiked) {
    console.log('content id :: ' + id);
    this.events.publish('showLoading');
    if (isLiked == null || isLiked == undefined)
      isLiked = false;
    console.log('userId :: ' + userId);
    console.log('isLiked :: ' + isLiked);

    let data = {
      "contentId": id,
      "userId": userId,
      "liked": !isLiked
    };
    this.bookmarkProvider.addRemoveLike(data, resp => {
      console.log('resp :: ' + resp);
      this.events.publish('dismissLoading');

      if (isLiked)
        this.showToast("Favourite removed successfully.!!");
      else
        this.showToast("Favourite added successfully.!!");

      this.loadAllContent();
    }, err => {
      this.events.publish('dismissLoading');
    });
  }

  openComment(c: any) {
    this.navCtrl.push('CommentsPage', { content_id: c.id })
  }
  share(c: any) {
    this.socialSharing.share('', '', '', 'https://google.com');
  }

  showToast(msg: string) {
    const toast = this.toastCtrl.create({
      message: msg,
      duration: 3000
    });
    toast.present();
  }

  async readMore(title, description) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: description,
      buttons: ['Cancel']
    });
    alert.present();
  }

  rate(content) {
    this.popupActive = true;
    this.rateContentId=content.id;
    this.userId=content.userId;
    let rate= Math.round( content.rating );
    //console.log('content.rating :: '+content.rating);
    //console.log('Math.round :: '+ Math.round( content.rating ) );   
    //console.log('Number.isNaN  :: '+Number.isNaN(rate));
    if(Number.isNaN(rate))
      this.rating=0;
    else
      this.rating=content.rating;

  }

  saveRating(){
    //console.log('this.rating :: '+this.rating);
    //console.log('this.rateContentId :: '+this.rateContentId);
   // console.log('this.userId :: '+this.userId);
   this.events.publish('showLoading');
    let data =  {
      "contentId" : this.rateContentId,
      "userId" : this.userId,
      "rate" : this.rating
      };

    this.bookmarkProvider.saveRating(data, resp => {
        console.log('resp :: ' + resp);
        this.events.publish('dismissLoading');
        this.showToast("Rating added successfully.!!");
        this.loadAllContent();
        this.popupActive = false;
    }, err => {
      this.events.publish('dismissLoading');
    });
  
  }

  close() {
    this.popupActive = false;
  }

}