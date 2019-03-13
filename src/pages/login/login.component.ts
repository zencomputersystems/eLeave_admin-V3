import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public showPassword: boolean = false;

  constructor() { }

  ngOnInit() {
  }

  showPasswordKey() {
    this.showPassword = true;
  }
  hidePasswordKey() {
    this.showPassword = false;
  }


}
