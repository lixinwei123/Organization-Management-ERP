import { Component, NgZone } from '@angular/core';
import { UserInfoService } from '../user-info.service';
@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  usrData: any
  isManager: boolean
  constructor(private uInfo: UserInfoService, public ngZone: NgZone) {
    this.loadUserInfo()
  }


  loadUserInfo(){
    this.usrData =  this.uInfo.$usrData
    let global  = this;
    if(this.usrData == undefined){
      setTimeout(() => {
        this.loadUserInfo()
      }, 1000);
    }else{
      this.uInfo.$usrData.subscribe({
        next(data){
          global.ngZone.run(() =>{
            global.isManager = data.isManager
          })
  
        }
      })
    }
  }
}
