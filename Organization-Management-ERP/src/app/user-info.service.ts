import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFireDatabase } from "@angular/fire/database";
import * as firebase from 'firebase';
import { Observable, Observer } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserInfoService {
public $usrData: Observable<any>
public usrData: any;
public usrId: any;
public usrAlerts: any;
public hasCorona: boolean = false;
// private dataSub = new Subject();
  constructor(public afAuth: AngularFireAuth, public  afData: AngularFireDatabase,
    public ngZone: NgZone
    ) {

   }

   setUserInfo(user){
     console.log("setting user",user)
    this.$usrData = new Observable((observer) =>{
      this.afData.database.ref('users/' + user.uid).on('value',dataSnap =>{
        // this.usrData = dataSnap.val();
        // this.usrId = user.uid
        console.log("loaded current user: ", this.usrData);
        observer.next(dataSnap.val())
      });
    }) 
 }

 setUserAlerts(){
   this.afData.database.ref('alerts/' + this.usrId).on('value',dataSnap =>{
     this.usrAlerts = dataSnap.val()
     console.log("new data added", this.usrAlerts)
   })
    
 }

 publishData(){
    return this.usrData
}

 setUserInfoById(id){
  return this.afData.database.ref('users/' + id).on('value',dataSnap =>{
   this.usrData = dataSnap.val();
   this.usrId = id
   console.log("loaded current user: ", this.usrData);
  //  this.events.publish('user:hasId',this.usrId);
 });
}

getHasRona(){
  return this.usrData.hasCorona
}
getUserInfo(){
	return this.usrData;
}

getUserId(){
  return this.usrId
}
getUserAlerts(){
  return this.usrAlerts;
}

setUserData(data){
  this.usrData = data
}
}