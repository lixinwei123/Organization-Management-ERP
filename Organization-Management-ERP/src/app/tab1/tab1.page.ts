import { Component } from '@angular/core';
import { UserInfoService } from '../user-info.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  constructor(public uInfo: UserInfoService) {
    console.log(this.uInfo.getUserInfo())
  }

}
