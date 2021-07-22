import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { UserInfoService } from '../user-info.service';
import {AngularFireDatabase} from "@angular/fire/database";
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  usrData : any;
  tasks: any = [];
  isAccepted: any;
  constructor(public uInfo: UserInfoService, public alertCtrl: AlertController, public afData: AngularFireDatabase) {
   
  }


  loadUserInfo(){
    this.usrData =  this.uInfo.$usrData
    let global = this;
    if(this.uInfo.$usrData == undefined){
      setTimeout(() => {
        this.loadUserInfo()
      }, 1000);
    }else{
      this.uInfo.$usrData.subscribe({
        next(data){
          console.log(data)
          global.usrData = data;
          let index = 0
          if(global.usrData.tasks){
            global.tasks = []
             for(let key in global.usrData.tasks){
               let styling = ["low-prio","medium-prio","high-prio"]
               let deadline = global.usrData.tasks[key]["deadline"].split("-")
               deadline = deadline[0] + "," + deadline[1] + "/" + deadline[2]
               deadline = deadline.split("T")
               deadline = deadline[0] + "," + deadline[1].split(":")[0] + ":" + deadline[1].split(":")[1]
                let obj = {
                  key: key,
                  deadline:deadline,
                  taskName: global.usrData.tasks[key]["taskName"],
                  priority: global.usrData.tasks[key]["priority"],
                  style_class: styling[global.usrData.tasks[key]["priority"] - 1],
                  isAccepted:  global.usrData.tasks[key]["isAccepted"],
                  index: 0
                }
                index += 1
                global.tasks.push(obj)
             }

          }
          console.log(global.tasks)
        }
      })
    }
  }

  ngOnInit(){
    this.loadUserInfo()
  }

  acceptJob(job){
    this.afData.database.ref("organizations").child(this.usrData.organizationId).child("tasks").child(job.key).update({"isAccepted":true}).then((success) =>{
      this.tasks[job.index].isAccepted = true
      this.afData.database.ref("users").child(this.usrData.id).child("tasks").child(job.key).update({"isAccepted":true})
    })
  }
  declineJob(job){
    console.log(job)
    this.presentAlertPrompt(job)
  }

  async presentAlertPrompt(job) {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Please provide a reason for the refusal',
      inputs: [
        {
          name: 'reason',
          type: 'textarea',
          placeholder: 'State your reasons here'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Submit',
          handler: (event) => {
            this.afData.database.ref("organizations").child(this.usrData.organizationId).child("tasks").child(job.key).update({"isAccepted":false,"declinedReason":event.reason}).then((success) =>{
              this.tasks[job.index].isAccepted = false
              this.afData.database.ref("users").child(this.usrData.id).child("tasks").child(job.key).update({"isAccepted":false})
            })
          }
        }
      ]
    });

    await alert.present();
  }
}
