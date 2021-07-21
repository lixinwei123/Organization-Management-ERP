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
  tasks: any = {
    open:[],
    accepted: [],
    declined: []
  }
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
            taskArr.push(obj)
          }
          let open = taskArr.filter((task) =>{
            if(!("isAccepted" in task)){
                return true
            }
          })
          let accepted = taskArr.filter((task) =>{
            return task["isAccepted"] == true
          })
          let declined = taskArr.filter((task) =>{
            return task["isAccepted"] == false
          })
          console.log("open tasks",accepted)
          console.log("organization details",global.organizationDetails)
        }
      })
    }
  }


  ngOnInit(){
    this.loadUserInfo()
    this.loadOrganizationDetails()
  }

  segmentChanged($event){
    let val = $event["detail"]["value"]
    console.log()
  }
}
