import { Component, OnInit } from '@angular/core';
import { LocalStorageService, SessionStorageService, LocalStorage, SessionStorage } from 'angular-web-storage';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  
  constructor(public local: LocalStorageService) {}  

  //list of names stored somewhere
  names = this.local.get("names");
  user = "";

  //sends the given value to a json/database/localstorage
  sendname(){
    console.log(this.user)
    console.log(this.names)
    if(this.names === null){
      this.names = []
    }
    //check if user ecxists
    if(this.names.includes(this.user)){
      console.log("user already excists!")
      return;
    }

    //check if user is empty
    if (this.user === "") {return;}
    //simply push the new name to the local list
    this.names.push(this.user)
    this.local.clear();
    this.local.set("names", this.names);
  }
  
  //the currently picked name
  pickedname = "";
  
  //random number between min and max 
  random(min , max){  
    var random = Math.floor(Math.random() * (+max - +min)) + +min;
    return random;
  }
  
  //picks a random name to be chosen
  pickrandom(){
    this.pickedname = this.names[this.random(0, this.names.length)]
  }
}
