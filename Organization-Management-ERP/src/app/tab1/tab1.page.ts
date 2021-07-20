import { Component } from '@angular/core';
import { UserInfoService } from '../user-info.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  usrData : any;
  constructor(public uInfo: UserInfoService) {
   
  }


  loadUserInfo(){
    this.usrData =  this.uInfo.$usrData
    if(this.uInfo.$usrData == undefined){
      setTimeout(() => {
        this.loadUserInfo()
      }, 1000);
    }else{
      this.uInfo.$usrData.subscribe({
        next(data){
          this.usrData = data;
          console.log(data)
        }
      })
    }
  }

  ngOnInit(){
    this.loadUserInfo()
  }
}
