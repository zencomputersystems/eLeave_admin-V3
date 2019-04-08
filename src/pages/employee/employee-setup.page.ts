export class ISubSideMenu {
  title: string;
  url: string[];
  icon: string;
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { APIService } from 'src/services/shared-service/api.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-employee-setup',
  templateUrl: './employee-setup.page.html',
  styleUrls: ['./employee-setup.page.scss'],
})
export class EmployeeSetupPage implements OnInit {

  public numOfArray: number;
  public userId: string;
  public list: any;
  public employeeSetupPage: ISubSideMenu[] = [
    {
      title: 'Personal Details',
      url: ['personal-details'],
      icon: 'desktop',
    },
    {
      title: 'Employment Details',
      url: ['employment-details', this.userId],
      icon: 'mail-unread',
    },
    {
      title: 'Leave Entitlement',
      url: ['leave-entitlement'],
      icon: 'calendar',
    },
    {
      title: 'Awards & Certification',
      url: ['awards-certification'],
      icon: 'people',
    },
    {
      title: 'My Connections',
      url: ['connection'],
      icon: 'people',
    },
    {
      title: 'Account Settings',
      url: ['account'],
      icon: 'people',
    }
  ];;

  get personalList() {
    return this.list;
  }
  constructor(private route: ActivatedRoute, private apiService: APIService,
    private router: Router) {
  }

  ngOnInit() {
    this.apiService.get_personal_details().subscribe(data => {
      this.userId = data.id;
      this.list = data;
      this.employeeSetupPage[1].url = ['employment-details', this.userId];
    });

    for (let i = 0; i < this.employeeSetupPage.length; i++) {
      if (this.employeeSetupPage[i].url.includes(this.route.firstChild.snapshot.routeConfig.path)) {
        this.getIndexToShowArrow(i);
      }
    }
  }

  getIndexToShowArrow(index: number) {
    this.numOfArray = index;
    // this.router.navigate(this.employeeSetupPage[index].url);
    this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe(r => {
      // console.log(r);
    });
  }

}
