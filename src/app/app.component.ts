import { Component } from '@angular/core';
import { Platform} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginPage } from '../pages/login/login'
import { HomePage } from '../pages/home/home';
import { Storage } from '@ionic/storage';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any;

  constructor(
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    public storage: Storage,
  ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      this.checkLogin();
    });
  }

  checkLogin(){
    try{
     this.storage.get('loginRespoonse').then((loginRespoonse) => {
        console.log('loginRespoonse is', loginRespoonse);
        if(loginRespoonse!=undefined && loginRespoonse!=null && loginRespoonse!="null" && loginRespoonse!="undefined" && loginRespoonse!="" ){
          this.storage.get('serverName').then((serverName)=>{
            console.log('serverName is',serverName);
            this.rootPage = HomePage;
          })
        }else{
          this.rootPage = LoginPage;
        }
      });
    }catch(e){
      console.log("Error in checkLogin::",e);
    }
  }
}

