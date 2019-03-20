import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

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
      url: 'personal-details',
      icon: 'desktop',
    },
    {
      title: 'Employment Details',
      url: 'employment-details',
      icon: 'mail-unread',
    },
    {
      title: 'Leave Entitlement',
      url: 'leave-entitlement',
      icon: 'calendar',
    },
    {
      title: 'Awards & Certification',
      url: 'awards-certification',
      icon: 'people',
    },
    {
      title: 'My Connections',
      url: 'connection',
      icon: 'people',
    },
    {
      title: 'Account',
      url: 'account',
      icon: 'people',
    }
  ];

  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    for (let i = 0; i < this.employeeSetupPage.length; i++) {
      if (this.employeeSetupPage[i].url === this.activatedRoute.firstChild.snapshot.routeConfig.path) {
        this.getIndexToShowArrow(i);
      }
    }
  }

  getIndexToShowArrow(index: number) {
    this.numOfArray = index;
  }

}
