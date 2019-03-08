import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-employee-setup',
  templateUrl: './employee-setup.page.html',
  styleUrls: ['./employee-setup.page.scss'],
})
export class EmployeeSetupPage implements OnInit {

  public numOfArray: number;

  public employeeSetupPage = [
    {
      title: 'Personal Details',
      url: '/employee-setup/personal-details',
      icon: 'desktop',
    },
    {
      title: 'Employment Details',
      url: '/employee-setup/employment-details',
      icon: 'mail-unread',
    },
    {
      title: 'Leave Entitlement',
      url: '/employee-setup/leave-entitlement',
      icon: 'calendar',
    },
    {
      title: 'Awards & Certification',
      url: '/employee-setup/awards-certification',
      icon: 'people',
    },
    {
      title: 'My Connections',
      url: '/employee-setup/connection',
      icon: 'people',
    },
    {
      title: 'Account',
      url: 'account',
      icon: 'people',
    }
  ];

  constructor(private router: Router) { }

  ngOnInit() {
    for (let i = 0; i < this.employeeSetupPage.length; i++) {
      if (this.router.url === this.employeeSetupPage[i].url) {
        this.getIndexToShowArrow(i);
      }
    }
  }

  getIndexToShowArrow(index) {
    this.numOfArray = index;
  }

}
