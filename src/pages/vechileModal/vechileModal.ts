import { Component, ViewChild, ElementRef  } from '@angular/core';
import { NavController,NavParams,PopoverController,ModalController,ViewController } from 'ionic-angular';

@Component({
   templateUrl: 'vechileModal.html',
   selector: 'page-vechileModal',
})
export class vechileDetails {
public details:any;
 constructor(
   public params: NavParams,
    public viewCtrl: ViewController,
  ) {
    this.details= this.params.get('details');
    console.log('details', this.params.get('details'));
 }

 closeModal(){
   try{
    this.viewCtrl.dismiss();
   }catch(e){
     console.log("Error in closeModal::",e);
   }
 }

}
