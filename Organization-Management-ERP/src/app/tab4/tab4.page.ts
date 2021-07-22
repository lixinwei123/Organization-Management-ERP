import { Component, NgZone, OnInit } from '@angular/core';
import { AlertController, PickerController } from '@ionic/angular';
import { PickerOptions } from '@ionic/core';
import { UserInfoService } from '../user-info.service';
import {AngularFireDatabase} from "@angular/fire/database";
import { NullTemplateVisitor } from '@angular/compiler';
@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
})
export class Tab4Page implements OnInit {

  constructor(public pickerCtrl:PickerController, public ngZone: NgZone, private uInfo: UserInfoService,
    private afData: AngularFireDatabase,
    public alertCtrl: AlertController) { }
  priority: any;
  priorityText: any = "press to choose priority"
  isDirectAssignee: boolean;
  isAssignByRole: Boolean;
  organizationDetails: any;
  $userSearch: any;
  organizationMembers: any = [];
  selectedAssignee:any;
  taskName: string;
  deadline: string;
  ngOnInit() {
    this.loadOrganizationDetails()
  }

  async presentPrioritySelector(){
    let global = this;
    let options: PickerOptions = {
      cssClass: "priority-popover-selector",
      buttons: [
        {
          text: "Cancel",
          role: "cancel"
        },
        {
          text:"OK",
        }
      ],
      columns: [
        {
          name: "Priority",
          options: [
            { text: "Low", value: 1},
            { text: "Medium", value: 2},
            { text: "High", value: 3}
          ]
        }
      ]
    };
    let picker = await this.pickerCtrl.create(options);
    //Selects the index which the user is currently on.
    picker.columns[0].selectedIndex = this.priority - 1;
    await picker.present();
    picker.onDidDismiss().then(async data => {
      let col = await picker.getColumn("Priority");
      let selected = col.options[col.selectedIndex].value;
      global.priorityText = col["options"][selected - 1]["text"]
      if (selected != this.priority) {
        this.priority = selected;
      } 
    });
  }

  searchUsers($event){
    this.$userSearch =  $event.target.value;
    let members = this.organizationDetails["members"]
    this.organizationMembers = []
    for(let key in members){
      let userObj = {
        "firstname":members[key]["firstname"],
        "lastname":members[key]["lastname"],
        "id":key
    }
    this.organizationMembers.push(userObj)
    }
    console.log(this.organizationMembers)
    this.organizationMembers = this.organizationMembers.filter((user) =>{
      console.log(user)
      return user.id.indexOf(this.$userSearch) > -1  ||
       (user.firstname + " " + user.lastname).toLowerCase().indexOf(this.$userSearch.toLowerCase()) > -1
    })
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
          console.log("organization details",global.organizationDetails)
        }
      })
    }

  }

  chooseUser(user){
    console.log(user)
    this.selectedAssignee = user;
    this.organizationMembers = []
    this.$userSearch = ""
  }

  assignTask(){
    let taskDetail;
    if(this.isDirectAssignee){
      taskDetail = {
        taskName: this.taskName,
        deadline: this.deadline,
        priority: this.priorityText,
        isDirectAssignee: this.isDirectAssignee,
        firstname: this.selectedAssignee.firstname,
        lastname: this.selectedAssignee.lastname,
        userid: this.selectedAssignee.id,
        // isAccepted: null,
        // isDeclined: false
      }
    }else{
        taskDetail = {
        taskName: this.taskName,
        deadline: this.deadline,
        priority: this.priorityText,
        isDirectAssignee: this.isDirectAssignee
      }
    }
    console.log(taskDetail)
    this.afData.database.ref("organizations").child(this.organizationDetails.id).child("tasks").push(taskDetail).then((val) =>{
      let key = val.key
      let obj = {
        taskName: this.taskName,
        deadline: this.deadline,
        priority: this.priority,
      }
      this.afData.database.ref("users").child(this.selectedAssignee.id).child("tasks").child(key).update(obj).then((success) =>{
        this.alert("success!","Task has been successfully created")
        this.deadline = null 
        this.taskName = null 
        this.priorityText = "press to choose priority"
        this.isDirectAssignee = false 
        this.selectedAssignee = null
        this.organizationMembers = []
      })
    })

  }

  async alert(title,content) {
    const alert = await this.alertCtrl.create({
      // cssClass: 'my-custom-class',
      header: title,
      // subHeader: 'Subtitle',
      message: content,
      buttons: ['OK']
    });
    await alert.present();
  }

}
