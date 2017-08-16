import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login'
import { HttpModule,Http, Headers, RequestOptions, Response } from '@angular/http';
import { CallNumber } from '@ionic-native/call-number';
import { MoreMenu } from '../pages/moreMenu/moreMenu';
import { SMS } from '@ionic-native/sms';
import { SocialSharing } from '@ionic-native/social-sharing';
import { vechileDetails } from '../pages/vechileModal/vechileModal';
import { IonicStorageModule } from '@ionic/storage';
import { TextToSpeech } from '@ionic-native/text-to-speech';
import { Diagnostic } from '@ionic-native/diagnostic';
@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    MoreMenu,
    vechileDetails
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    MoreMenu,
    vechileDetails
  ],
  providers: [
    StatusBar,
    SplashScreen,
    CallNumber,
    SMS,
    SocialSharing,
    TextToSpeech,
    Diagnostic,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
