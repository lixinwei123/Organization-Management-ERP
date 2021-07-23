import { Component, NgZone } from '@angular/core';
import { UserInfoService } from '../user-info.service';
@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  usrData : any;
  organizationDetails: any;
  currentTab: any;
  tasks: any = {
    open:[],
    accepted: [],
    declined: [],
    completed: []
  }
  mainTasks: any = []
  constructor(public uInfo: UserInfoService, public ngZone: NgZone) {
  }


  

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

  
  loadOrganizationDetails(){
    let global = this;
    this.organizationDetails = this.uInfo.$organizationDetails
    if(this.organizationDetails == undefined){
      setTimeout(() => {
        this.loadOrganizationDetails()
      }, 1000);
    }else{
      this.organizationDetails.subscribe({
        next(data){
          global.organizationDetails = data
          let tasks = global.organizationDetails["tasks"]
          let taskArr = []
          for(let key in tasks){
            let obj = tasks[key]
            obj["key"] = key
            let deadline = obj["deadline"] .split("-")
            deadline = deadline[0] + "," + deadline[1] + "/" + deadline[2]
            deadline = deadline.split("T")
            deadline = deadline[0] + "," + deadline[1].split(":")[0] + ":" + deadline[1].split(":")[1]
            obj["deadline"] = deadline
            taskArr.push(obj)
          }
          let open = taskArr.filter((task) =>{
            if(!("isAccepted" in task)){
                return true
            }
          })
          let accepted = taskArr.filter((task) =>{
            return task["isAccepted"] == true && !task["isCompleted"]
          })
          let declined = taskArr.filter((task) =>{
            return task["isAccepted"] == false
          })
          let completed =  taskArr.filter((task) =>{
            return task["isCompleted"] == true
          })
          global.tasks["open"] = open 
          global.tasks["accepted"] = accepted 
          global.tasks["declined"] = declined 
          global.tasks["completed"] = completed
          console.log("open tasks",accepted)
          console.log("organization details",global.organizationDetails)
          global.mainTasks = global.tasks[global.currentTab]
        }
      })
    }
  }


  ngOnInit(){
    this.currentTab = "open"
    this.loadUserInfo()
    this.loadOrganizationDetails()
  }

  segmentChanged($event){
    let val = $event["detail"]["value"]
    this.currentTab = val
    this.mainTasks = this.tasks[this.currentTab]
  }
}
