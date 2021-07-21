import { Component } from '@angular/core';
import { UserInfoService } from '../user-info.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  usrData : any;
  tasks: any = [];
  constructor(public uInfo: UserInfoService) {
   
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
          global.usrData = data;
          if(global.usrData.tasks){
             for(let key in global.usrData.tasks){
                let obj = {
                  key: key,
                  deadline: global.usrData.tasks["deadline"],
                  taskName: global.usrData.tasks["taskName"],
                  priority: global.usrData.tasks["priority"]
                }
                global.tasks.push(obj)
             }
          }
          console.log(data)
        }
      })
    }
  }

  ngOnInit(){
    this.loadUserInfo()
  }
}
