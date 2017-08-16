import { Component, ViewChild, ElementRef  } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, AbstractControl, Validators } from '@angular/forms';
import { NavController,Platform,AlertController } from 'ionic-angular';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import _ from 'underscore';
import { HomePage } from '../home/home';
import { Storage } from '@ionic/storage';
import { Diagnostic } from '@ionic-native/diagnostic';
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  public URL : string = null;
  public loginDisabled : boolean = false;
  private http: Http;
  public user: any;
  public initialize: any;
  public loginResponse:any;
  constructor(
    public navCtrl: NavController,
    http: Http,
    public formBuilder: FormBuilder,
    public storage: Storage,
    public diagnostic:Diagnostic,
    public platform:Platform,
    public alertCtrl: AlertController,
  ) {
    this.http = http;
     this.user = this.formBuilder.group({
      trackId: ['7090774349', Validators.required],
      serverName: ['trac8.suveechi.com', Validators.required],
    });
  }

  ionViewWillEnter(){
    try{
        this.platform.resume.subscribe(resume=>{
          this.diagnostic.isLocationAuthorized().then(enabled=>{
                  console.log("Location is " + (enabled ? "enabled" : "disabled"));
                  if(!enabled){
                    this.diagnostic.requestLocationAuthorization().then(status=>{
                        console.log("Authorization status is now: "+status);
                    },error=>{
                        console.error(error);
                    });
                  };
              }, error=>{
              console.error("The following error occurred: "+error);
            });
        });
        this.diagnostic.isLocationEnabled().then(success =>{
            console.log("islocationenabled::",success);
            if(success){
              this.diagnostic.isLocationAuthorized().then(enabled=>{
                  console.log("Location is " + (enabled ? "enabled" : "disabled"));
                  if(!enabled){
                    this.diagnostic.requestLocationAuthorization().then(status=>{
                        console.log("Authorization status is now: "+status);
                    },error=>{
                        console.error(error);
                    });
                  };
              }, error=>{
              console.error("The following error occurred: "+error);
            });
          }else{
            let alert = this.alertCtrl.create({
              title: "Location Permission",
              message: 'Please enable the location from settings?',
              buttons: [
                {
                  text: 'No',
                  role: 'cancel',
                  handler: () => {
                    console.log('Cancel clicked');
                  }
                },
                {
                  text: 'Yes',
                  handler: () => {
                    console.log('Accept clicked');
                    this.diagnostic.switchToLocationSettings();
                  }
                }
              ]
            });
            alert.present();
          }
        },error=>{
          console.log("islocationenabled error::",error);
        });
    }catch(e){
      console.log("Error in login enter::",e);
    }
  }

  login(trackId,serverName){
    try{
      let mUrl = "http://" + serverName + "/k/api.php?type=login&mobileno="+trackId;
      let headers = new Headers({ 'Content-Type': 'application/json', 'Content-Encoding': 'gzip' });
      let requestOptions = new RequestOptions({ headers: headers });
       this.http.get(mUrl,requestOptions).subscribe((responseData) => {
          console.log("Response Data::",responseData);
          this.loginResponse=JSON.parse(responseData['_body']);
          this.loginDisabled = false;
          this.storage.set('loginRespoonse', this.loginResponse);
          this.storage.set('serverName',serverName);
          this.navCtrl.push(HomePage,{loginRespoonse:this.loginResponse,serverName:serverName});
      },(error)=>{
        console.log("Error while login::",error);
         this.loginDisabled = false;
      });
    }catch(e){
      console.log("Error in login::",e);
    }
  }

  loginMe(){
    try{
      console.log(this.user.value);
      this.loginDisabled = true;
      this.initialize = _.once(this.login);
      this.initialize(this.user.value.trackId, this.user.value.serverName);
    }catch(e){
      console.log("Error in loginMe::",e);
    }
  }

}
