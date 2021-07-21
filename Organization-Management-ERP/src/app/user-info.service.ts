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
public $organizationDetails: Observable<any>
// private dataSub = new Subject();
  constructor(public afAuth: AngularFireAuth, public  afData: AngularFireDatabase,
    public ngZone: NgZone
    ) {

   }

   setUserInfo(user){
     console.log("setting user",user)
     this.$usrData = new Observable((observer) =>{
      this.afData.database.ref('users/' + user.uid).on('value',dataSnap =>{
        this.usrData = dataSnap.val()
        this.usrData["id"] = user.uid
        this.setOrganizationDetails(this.usrData["organizationId"])
        observer.next(this.usrData)
      });
    })
 }


 setOrganizationDetails(id){
   this.$organizationDetails = new Observable((observer) =>{
    this.afData.database.ref("organizations").child(id).on('value',dataSnap =>{
      let data = dataSnap.val()
      data["id"] = id
      observer.next(data)
    })
   })
 }

 publishData(){
    return this.usrData
}

 setUserInfoById(id){
  return this.afData.database.ref('users/' + id).on('value',dataSnap =>{
   this.usrData = dataSnap.val();
   console.log("loaded current user: ", this.usrData);
  //  this.events.publish('user:hasId',this.usrId);
 });
}

setUserData(data){
  this.usrData = data
}
}