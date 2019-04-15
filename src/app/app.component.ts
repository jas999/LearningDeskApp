import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, App, Events, LoadingController, NavController, MenuController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TabPage } from '../pages/tabs/tab';
import { AuthProvider } from '../providers/auth/auth';
import { User } from '../models/user.models';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;
  public loading;
  public user: User;
  firstname:string='';
  lastname:string='';
  emailId:string='';
  pages: Array<{ icon: string, title: string, component: any, index: any }>;

  constructor(public platform: Platform, public statusBar: StatusBar, public loadingCtrl: LoadingController
    , public sideMenu: MenuController
    , public splashScreen: SplashScreen, private app: App, public events: Events, public auth: AuthProvider,) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { icon: 'ios-home', title: 'HOME', component: TabPage, index: 0 },
      { icon: 'ios-list-box', title: 'LIST', component: 'ListPage', index: null },
      { icon: 'ios-bookmarks', title: 'BOOKMARK', component: 'BookmarkPage', index: null },
      { icon: 'ios-bookmarks', title: 'FEEDBACK', component: 'BookmarkPage', index: null }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.events.subscribe('showLoading', () => {
        this.showLoading();
      });
      this.events.subscribe('dismissLoading', () => {
        this.dismissLoading();
      });

      this.events.subscribe('UserInfo:generated', (user) => {
        this.user = user;
        if(this.user){
          this.firstname = this.user.firstname;
          this.lastname = this.user.lastname;
          this.emailId = this.user.emailId;   
         }
      });

      this.user = this.auth.getUserFromStroage();      
     if(this.user){
      this.firstname = this.user.firstname;
      this.lastname = this.user.lastname;
      this.emailId = this.user.emailId;
      this.nav.setRoot(TabPage,{ tabIndex: 0 });   
     }else{
      this.rootPage= 'LoginPage';
     }

    });
  }

  showLoading() {
    if (this.loading == null) {
      this.loading = this.loadingCtrl.create({
        content: 'Please wait...'
      });
      this.loading.present();
    }
  }
  dismissLoading() {
    if (this.loading != null) {
      this.loading.dismiss();
      this.loading = null;
    }
  }
  /* openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  } */
  openPage(page) {
    console.log('openPage called:: page.component :: '+page.component);
    let params = {};
    console.log('openPage called page.index :: '+page.index)
    // The index is equal to the order of our tabs inside tabs.ts
    if (page.index) {
      params = { tabIndex: page.index };
    }
    console.log(page.index)
    if (this.nav.getActiveChildNav() && page.index != undefined) {
      this.nav.getActiveChildNav().select(page.index);
    } else {
      // Tabs are not active, so reset the root page 
      // In this case: moving to or from SpecialPage
      this.nav.setRoot(page.component, params);
    }

  }

  logout(){
    this.auth.removeUserFromStroage();
    this.sideMenu.close();
    this.nav.setRoot("LoginPage");
  }
}
