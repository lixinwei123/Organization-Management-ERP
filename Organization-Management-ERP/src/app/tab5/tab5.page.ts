import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab5',
  templateUrl: './tab5.page.html',
  styleUrls: ['./tab5.page.scss'],
})
export class Tab5Page implements OnInit {

  constructor(private afAuth:AngularFireAuth,private afData:AngularFireDatabase,public router:Router) { }

  ngOnInit() {
  }




  
  logOut(){
    this.afAuth.signOut().then(() =>{
      this.router.navigateByUrl('/login');
    })
  }
}
