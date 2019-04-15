import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { TabPage } from '../pages/tabs/tab'
import { HttpClientModule } from '@angular/common/http';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { BookmarkProvider } from '../providers/bookmark/bookmark';
import { Camera } from '@ionic-native/camera';
import { CategoryProvider } from '../providers/category/category';
import { ContentProvider } from '../providers/content/content';
import { FileChooser } from '@ionic-native/file-chooser';
import { FilePath } from '@ionic-native/file-path';
import { Base64 } from '@ionic-native/base64';
import { File } from '@ionic-native/file';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player';
import { FileOpener } from '@ionic-native/file-opener';
import { AuthProvider } from '../providers/auth/auth';
import { SocialSharing } from '@ionic-native/social-sharing';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { GooglePlus } from '@ionic-native/google-plus';

@NgModule({
  declarations: [
    MyApp,
    TabPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    TabPage
  ],
  providers: [
    StatusBar,
    Camera,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    BookmarkProvider,
    CategoryProvider,
    CategoryProvider,
    ContentProvider,
    FileChooser,
    FilePath,
    Base64,
    File,
    FileTransfer, 
    FileTransferObject,
    AndroidPermissions,
    YoutubeVideoPlayer,
    FileOpener,
    AuthProvider,
    Facebook,
    SocialSharing,
    GooglePlus
  ]
})
export class AppModule { }
