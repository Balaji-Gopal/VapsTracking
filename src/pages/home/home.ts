import { Component, ViewChild, ElementRef  } from '@angular/core';
import { NavController,NavParams,PopoverController,ModalController,Platform,AlertController } from 'ionic-angular';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { CallNumber } from '@ionic-native/call-number';
import { MoreMenu } from '../moreMenu/moreMenu';
import { SMS } from '@ionic-native/sms';
import _ from 'underscore';
import { SocialSharing } from '@ionic-native/social-sharing';
import { vechileDetails } from '../vechileModal/vechileModal';
import { Storage } from '@ionic/storage';
import { TextToSpeech } from '@ionic-native/text-to-speech';
import { Diagnostic } from '@ionic-native/diagnostic';
declare var google;
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  public URL : string = null;
  public vehicleResponse: any;
  private http: Http;
  public loginRespoonse:any;
  public serverName:any;
  public welcomeName:any;
  public unitname:any;
  public marker:any= null;
  //Access the map div element
  @ViewChild('map') mapElement: ElementRef;
  map: any;
  constructor(
    public navCtrl: NavController,
    http: Http,
    public navParams: NavParams,
    public callNumber: CallNumber,
    public popoverCtrl: PopoverController,
    public sms: SMS,
    public socialSharing: SocialSharing,
    public modalCtrl: ModalController,
    public storage: Storage,
    public tts: TextToSpeech,
    public diagnostic:Diagnostic,
    public platform:Platform,
    public alertCtrl: AlertController,
  ) {
    this.http = http;
  }

  ionViewWillEnter(){
    try{
        this.storage.get('loginRespoonse').then((loginRespoonse) => {
          console.log('loginRespoonse is', loginRespoonse);
          if(loginRespoonse!=undefined && loginRespoonse!=null && loginRespoonse!="null" && loginRespoonse!="undefined" && loginRespoonse!="" ){
            this.storage.get('serverName').then((serverName)=>{
              console.log('serverName is',serverName);
              this.loginRespoonse=loginRespoonse;
              this.serverName=serverName;
              this.welcomeName=loginRespoonse.parentname;
              this.executeRefresh();
            })
          }else{
            this.loginRespoonse=this.navParams.get('loginRespoonse');
            console.log("Login Response from params::",this.loginRespoonse)
            this.serverName=this.navParams.get('serverName');
            this.welcomeName=this.loginRespoonse.parentname;
            this.executeRefresh();
          }
        });
    }catch(e){
      console.log("Error in willenter::",e);
    }
  }

  executeRefresh(){
    try{
      this.refreshMap();
      setInterval(()=>{
        this.refreshMap();
      },1000*60);
    }catch(e){
      console.log("Error in ionViewDidEnter::",e);
    }
  }

  refreshMap(){
    try{
      console.log("entered into refreshMap");
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
      let headers = new Headers({ 'Content-Type': 'application/json', 'Content-Encoding': 'gzip' });
      let requestOptions = new RequestOptions({ headers: headers });
      this.URL="http://"+this.serverName+"/k/api.php?type=vehicleList&mobileno="+this.loginRespoonse.mobileno;
      this.http.get(this.URL,requestOptions).subscribe((responseData) => {
        console.log("Response Data::",responseData);
         this.vehicleResponse=JSON.parse(responseData['_body']);
        if( this.vehicleResponse.status=="success"){
          this.unitname=this.vehicleResponse.vehicle.unitname;
          this.loadMap(this.vehicleResponse.vehicle.latitude,this.vehicleResponse.vehicle.longitude)
        }
      });
    }catch(e){
      console.log("Error in refreshMap::",e);
    }
  }

  //Function which adds the information box to the map location marker
  addInfoWindow(marker, content){
    try{
      let infoWindow = new google.maps.InfoWindow({
        content: content
      });
      infoWindow.open(this.map, marker);
    }catch(e){
      console.log("Error in the addInfoWindow::"+e);
    }
  };

  //Function which sets the information to be added to the map location marker
  setMarker(latitude, longitude){
    try{
      let icon = {
          url: "assets/img/bus_marker.png", // url
          scaledSize: new google.maps.Size(20, 20), // scaled size
          origin: new google.maps.Point(0,0), // origin
          anchor: new google.maps.Point(0, 0) // anchor
      }
       this.marker = new google.maps.Marker({
        map: this.map,
        animation: google.maps.Animation.DROP,
        position: this.map.getCenter(),
        icon: icon
      });
      this.addInfoWindow(this.marker,"<div>"+this.vehicleResponse.vehicle.location+"</div></br><div>Report Time:"+this.vehicleResponse.vehicle.reporttime+"</div>")
      let splitLocation=this.vehicleResponse.vehicle.location.toString().split('*')
      let speech = "Vehicle number "+this.vehicleResponse.vehicle.unitname+" is " + splitLocation[0];
      this.tts.speak({text:speech,locale: 'en-GB',rate: 0.75}).then(
        () => console.log('Success')
      ).catch(
        (reason: any) => console.log(reason)
      );
  }catch(e){
      console.log("Error in setMarker::"+e);
    }
  };

  moveMarker(latitude,longitude){
    try{
      this.marker.setPosition(new google.maps.LatLng(latitude,longitude));
      this.addInfoWindow(this.marker,"<div>"+this.vehicleResponse.vehicle.location+"</div></br><div>Report Time:"+this.vehicleResponse.vehicle.reporttime+"</div>")
      let splitLocation=this.vehicleResponse.vehicle.location.toString().split('*')
      let speech = "Vehicle number "+this.vehicleResponse.vehicle.unitname+" is " + splitLocation[0];
      this.tts.speak({text:speech,locale: 'en-GB',rate: 0.75}).then(
        () => console.log('Success')
      ).catch(
        (reason: any) => console.log(reason)
      );
    }catch(e){
      console.log("error in movemarker::",e)
    }
  }

  //Fucntion which laods the current location map based on the co-ordinates given
  loadMap(latitude, longitude){
    try{
      if(this.marker!=null){
        this.moveMarker(latitude,longitude);
      }else{
        let latLng = new google.maps.LatLng(latitude, longitude);
        let mapOptions = {
          center: latLng,
          zoom: 15,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          zoomControl: false,
          mapTypeControl: false,
          scaleControl: false,
          streetViewControl: false,
          rotateControl: false,
          fullscreenControl: false
        }
        this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
        this.setMarker(latitude, longitude);
      }
    }catch(e){
      console.log("Error in loadMap::"+e);
    }
  };

  dial(){
    try{
      console.log("Dial Number::",this.loginRespoonse.callno);
      this.callNumber.callNumber(this.loginRespoonse.callno, true).then(
        (success) =>{
           console.log('Launched dialer!',success)
        },
        (error)=>{
            console.log('Launched dialer!',error);
        });
    }catch(e){
      console.log("Error in dial::",e);
    }
  }

  sendSMS(){
    try{
      console.log("Dial Number::",this.loginRespoonse.smsno)
      this.sms.send(this.loginRespoonse.smsno, '',{replaceLineBreaks:false,android:{intent:'INTENT'}});
    }catch(e){
      console.log("Error in sendSMS::",e)
    }
  }

  sendPanicSMS(){
    try{
      console.log("Dial Number::",this.loginRespoonse.smsno)
      if(this.loginRespoonse.smsno!=="" && this.loginRespoonse.smsno!==null && this.loginRespoonse.smsno!=='null' && this.loginRespoonse.smsno!=='undefined' && this.loginRespoonse.smsno!==undefined){
        this.sms.send(this.loginRespoonse.smsno, '',{replaceLineBreaks:false,android:{intent:'INTENT'}});
      }else{
        console.log("No Panic Number");
      }
    }catch(e){
      console.log("Error in sendSMS::",e)
    }
  }

  presentPopover(myEvent) {
    try{
      let popover = this.popoverCtrl.create(MoreMenu,{details:this.vehicleResponse.vehicle});
      popover.present({
        ev: myEvent
      });
    }catch(e){
      console.log("Error in presentPopover::",e);
    }
  }

  sendWhatsappMsg(){
    try{
//this.socialSharing.shareViaWhatsAppToReceiver(this.loginRespoonse.whastappno,"http://maps.apple.com/?z=18&q=" + this.vehicleResponse.vehicle.latitude+","+this.vehicleResponse.vehicle.longitude, null,null).then((success) => {
      this.socialSharing.shareViaWhatsApp('',null,"http://maps.apple.com/?z=18&q=" + this.vehicleResponse.vehicle.latitude+","+this.vehicleResponse.vehicle.longitude).then((success) => {
        // Success!
        console.log("Whatspp success::",success)
      },(error) => {
        // Error!
        console.log("Whatspp Error::",error)
      });
    }catch(e){
      console.log("Error in whatsapp msg::",e);
    }
  }

}
