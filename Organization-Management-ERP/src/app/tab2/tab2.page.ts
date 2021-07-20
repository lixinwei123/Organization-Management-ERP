import { Component, NgZone } from '@angular/core';
import { UserInfoService } from '../user-info.service';
@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  usrData : any;
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

  ngOnInit(){
    this.loadUserInfo()
  }
}
