import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, ToastController } from 'ionic-angular';
import { ContentProvider } from '../../providers/content/content';
import { Comment } from '../../models/comment.models';
import { AuthProvider } from '../../providers/auth/auth';

/**
 * Generated class for the CommentsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-comments',
  templateUrl: 'comments.html',
})
export class CommentsPage {

  content_id:string;
  private comments:Array<Comment>;
  constructor(public navCtrl: NavController, public navParams: NavParams, public toastCtrl: ToastController
    , public contentProvider: ContentProvider, public events:Events, public auth: AuthProvider) {
    this.content_id=navParams.get("content_id");

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CommentsPage');
    this.contentProvider.getAllCommentsByContentId(this.content_id,resp=>{
      this.comments = resp;
    },error=>{
      
    });
  }

  sendComment(message:string){
    this.events.publish('showLoading');

    let data = {
      "contentId": this.content_id,
      "createdById": this.auth.getUserFromStroage().id,
      "comment": message
    };
    this.contentProvider.addComment(data, resp => {
      let comment:Comment = resp;
      this.comments.push(comment);
      this.events.publish('dismissLoading');
      this.showToast("Comment is added successfully.");
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
