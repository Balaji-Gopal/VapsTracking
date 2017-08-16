import { Component, ViewChild, ElementRef  } from '@angular/core';
import { NavController,NavParams,PopoverController,ViewController,ModalController  } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { vechileDetails } from '../vechileModal/vechileModal';
import { Storage } from '@ionic/storage';
@Component({
  template: `
    <ion-list style="margin:0px">
      <button ion-item (click)="presentVechileModal()"><img style="width: 10%;float: left;" src="assets/img/van.png"/><span style="padding-left: 10%;">Vehicle Details</span></button>
      <button ion-item (click)="logout()"><img style="width: 10%;float: left;" src="assets/img/logout.png"/><span style="padding-left: 10%;">Logout</span></button>
    </ion-list>
  `
})
export class MoreMenu {
  public details:any;
  constructor(
    public viewCtrl: ViewController,
    public nav: NavController,
    public modalCtrl: ModalController,
    public params: NavParams,
    public popoverCtrl: PopoverController,
    public storage: Storage
  ) {
    this.details= this.params.get('details');
    console.log('details', this.params.get('details'));
  }

  close() {
    this.viewCtrl.dismiss();
  }

  logout(){
    try{
      let self=this;
      //self.nav.parent.parent.setRoot(LoginPage);
      //self.nav.parent.setRoot(LoginPage);
      //self.nav.setRoot(LoginPage);
      //self.nav.popToRoot();
      this.storage.remove('loginRespoonse');
      this.storage.remove('serverName');
      self.nav.push(LoginPage);
    }catch(e){
      console.log("Error in logout::",e)
    }
  }

  presentVechileModal() {
    try{
      this.close();
      let profileModal = this.modalCtrl.create(vechileDetails, { details: this.details },{showBackdrop:false,enableBackdropDismiss:false,cssClass:'vehicle-popover'});
      profileModal.present();

      /*let popover = this.popoverCtrl.create(vechileDetails,{ details: this.details },{cssClass:'vehicle-popover'});
      popover.present({
      });*/
    }catch(e){
      console.log("Error in presentVechileModal::",e);
    }
  }
}
