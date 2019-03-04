import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-employee-setup',
  templateUrl: './employee-setup.page.html',
  styleUrls: ['./employee-setup.page.scss'],
})
export class EmployeeSetupPage implements OnInit {

  displayArrow: boolean = false;
  numOfArray: number;
  text1Color: string;
  text2Color: string;
  text3Color: string;
  text4Color: string;
  text5Color: string;
  text6Color: string;

  get showArrow(): boolean {
    return this.displayArrow;
  }

  public employeeSetupPage = [
    {
      title: 'Personal Details',
      url: '/employee-setup/personal-details',
      icon: 'desktop',
    },
    {
      title: 'Employment Details',
      url: '/inbox',
      icon: 'mail-unread',
    },
    {
      title: 'Leave Entitlement',
      url: '/plan-my-leave',
      icon: 'calendar',
    },
    {
      title: 'Awards & Certification',
      url: '/employee-setup',
      icon: 'people',
    },
    {
      title: 'My Connections',
      url: '/employee-setup',
      icon: 'people',
    },
    {
      title: 'Account',
      url: 'personal-details',
      icon: 'people',
    }
  ];

  constructor() { }

  ngOnInit() {
  }

  getIndexToShowArrow(index) {
    this.numOfArray = index;
  }

}
