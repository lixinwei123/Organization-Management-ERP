import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  constructor(private afAuth:AngularFireAuth,private afData:AngularFireDatabase,public router:Router) {}

  logOut(){
    this.afAuth.signOut().then(() =>{
      this.router.navigateByUrl('/login');
    })
  }
}
