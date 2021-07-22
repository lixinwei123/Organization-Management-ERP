import { Component, NgZone } from '@angular/core';
import { UserInfoService } from '../user-info.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  usrData: any
  isManager: boolean
  constructor(private uInfo: UserInfoService, public ngZone: NgZone,public router: Router) {
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
            if(global.isManager){
              global.router.navigateByUrl("/tabs/tab2")
            }
          })
  
        }
      })
    }
  }
}
