import { Component, OnInit, Input } from '@angular/core';
// import { FirebaseAuthentication } from '@ionic-native/firebase-authentication/ngx';
import { AngularFireAuth } from "@angular/fire/auth";
import {AngularFireDatabase} from "@angular/fire/database"
import { AlertController, ModalController, NavController, NavParams } from '@ionic/angular';
import { Injectable } from '@angular/core';
// import { File } from '@ionic-native/file/ngx';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
@Injectable()
export class RegisterComponent implements OnInit {
  text = "";
  password = "";
  email = "";
  passwordC = "";
  emailC = "";
  firstname = "";
  lastname = "";
  organizationName = "";
  organizationId = "";
  isManager: Boolean = false;
  constructor(public navCtrl: NavController,
   public modalCtrl: ModalController, 
    private afAuth: AngularFireAuth,
    private alertCtrl: AlertController,
    private afData: AngularFireDatabase,
    public navParam: NavParams
    ) {
    // console.log('Hello RegisterComponent Component');
    this.isManager = this.navParam.get("isManager")
  }

  closeModal(){
    this.modalCtrl.dismiss();
    // console.log('clicked on closeModal function');
  }
  ngOnInit() {
  }

  async alertError(error) {
    const alert = await this.alertCtrl.create({
      // cssClass: 'my-custom-class',
      header: 'Error',
      // subHeader: 'Subtitle',
      message: error,
      buttons: ['OK']
    });

    await alert.present();
  }
  finishRegistration(){
    //var database = Database.database();
    //var ref = database.ref("ID");
    //ref.on('ID', this.getID, this.err);
  
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (this.password != this.passwordC){
      this.alertError("Passwords do not match.");
    }
    else if (this.email != this.emailC){
      this.alertError("Emails do not match.");
    }
    else if(this.password.length < 7){
      // console.log(this.password, this.passwordC)
      this.alertError("The password should be at least 7 characters long.");
    }
    else if (re.test(String(this.email).toLowerCase()) == false){
      this.alertError("bad email");
    }
    else if (this.firstname == "")
    {
      this.alertError("Please enter your first name.")
    }
      else if (this.lastname == "")
    {
      this.alertError("Please enter your last name.")
    } 
      else if (this.organizationName.length < 1 && this.isManager){
        this.alertError("Please enter your organization name")
      }else if(this.organizationId.length < 1 && !this.isManager){
        this.alertError("Please enter your organization Id")
      }
    else{

    if(!this.isManager){
      this.afData.database.ref("organizations").child(this.organizationId).once("value",(snapshot) =>{
        if(snapshot.exists()){
          this.createUser()
        }else{
          this.alertError("please make sure the organization id exists")
        }

      })
    }else{
      this.createUser()
    }

    }
  }

  createUser(){
    var result = this.afAuth.createUserWithEmailAndPassword(this.email,this.password).then (res =>{
      let uid = res.user.uid
      let usrInfo = {
        email:this.email,
        firstname: this.firstname,
        lastname: this.lastname,
        isManager: this.isManager,
        organizationId: ""
      }
   if(this.isManager){
     let organizationDetails = {"organizationName":this.organizationName}
      this.afData.database.ref("organizations").push(organizationDetails).then((organId) =>{
        usrInfo["organizationId"] = organId.key;
        this.afData.database.ref("organizations").child(organId.key).child("members").child(uid).update({"tags":""})
        this.afData.database.ref('users').child(uid).update(usrInfo).then(() =>{
          this.closeModal()
         });
      })
   }else{
     this.afData.database.ref("organizations").child(this.organizationId).child("members").child(uid).update({"tags":""})
      usrInfo["organizationId"] = this.organizationId
      this.afData.database.ref('users').child(uid).update(usrInfo).then( success =>{
        this.closeModal()
       },
       fail =>{
         this.alertError("Please make sure ")
       });
   }

        //  console.log("registered",res.user.uid)

    },
      fail =>{
        this.alertError("invalid information or this email has already been used")
      }
    );
  }

}