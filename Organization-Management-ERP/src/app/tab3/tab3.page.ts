import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { UserInfoService } from '../user-info.service';
import {AngularFireDatabase} from "@angular/fire/database";
@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  usrData : any;
  tasks: any = [];
  isAccepted: any;
  constructor(public uInfo: UserInfoService, public alertCtrl: AlertController, public afData: AngularFireDatabase) {}

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
                  isCompleted: global.usrData.tasks[key]["isCompleted"],
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

  markComplete(task){
    console.log(this.usrData.organizationId)
    console.log(task)
    this.afData.database.ref("organizations").child(this.usrData.organizationId).child("tasks").child(task.key).update({"isCompleted":true}).then(success =>{
     this.afData.database.ref("users").child(this.usrData.id).child("tasks").child(task.key).update({"isCompleted":true}).then(success=>{
       console.log(success)
     })
    })
  }

  
}
