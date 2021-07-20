import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { UserInfoService } from '../user-info.service';

@Component({
  selector: 'app-tab5',
  templateUrl: './tab5.page.html',
  styleUrls: ['./tab5.page.scss'],
})
export class Tab5Page implements OnInit {

  usrData: any
  constructor(private afAuth:AngularFireAuth,private afData:AngularFireDatabase,public router:Router, public uInfo: UserInfoService) { }

  

  
  loadUserInfo(){
    let global = this;
    this.usrData =  this.uInfo.$usrData
    if(this.uInfo.$usrData == undefined){
      setTimeout(() => {
        this.loadUserInfo()
      }, 1000);
    }else{
      this.uInfo.$usrData.subscribe({
        next(data){
          global.usrData = data;
          console.log(data)
        }
      })
    }
  }

  ngOnInit() {
    this.loadUserInfo()
  }

  
  logOut(){
    this.afAuth.signOut().then(() =>{
      this.router.navigateByUrl('/login');
    })
  }
}
