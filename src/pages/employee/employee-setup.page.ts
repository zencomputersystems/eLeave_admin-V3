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
  public url: string;
  public lastSegment: string;
  public employeeSetupPage: ISubSideMenu[] = [
    {
      title: 'Personal Details',
      url: ['/main/employee-setup/personal-details'],
      icon: 'desktop',
    },
    {
      title: 'Employment Details',
      url: ['/main/employee-setup/employment-details', this.userId],
      icon: 'mail-unread',
    },
    {
      title: 'Leave Entitlement',
      url: ['/main/employee-setup/leave-entitlement'],
      icon: 'calendar',
    },
    {
      title: 'Awards & Certification',
      url: ['/main/employee-setup/awards-certification'],
      icon: 'people',
    },
    {
      title: 'My Connections',
      url: ['/main/employee-setup/connection'],
      icon: 'people',
    },
    {
      title: 'Account Settings',
      url: ['/main/employee-setup/account'],
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
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: NavigationEnd) => {
        this.url = e.urlAfterRedirects;
        this.checkUrl(this.url);
      });

    this.apiService.get_personal_details().subscribe(data => {
      this.userId = data.id;
      this.list = data;
      this.employeeSetupPage[1].url = ['/main/employee-setup/employment-details', this.userId];
    });
    this.checkUrl(this.router.url);
  }

  checkUrl(url: string) {
    const splitUrl = url.split('/');
    this.lastSegment = splitUrl.pop();
    const joinSplitUrl = splitUrl.join('/');
    if (joinSplitUrl === '/main/employee-setup/employment-details') {
      this.getIndexToShowArrow(1);
    } else {
      for (let i = 0; i < this.employeeSetupPage.length; i++) {
        if (this.employeeSetupPage[i].url.includes(url)) {
          this.getIndexToShowArrow(i);
        }
      }
    }
  }

  getIndexToShowArrow(index: number) {
    this.numOfArray = index;
    if (this.employeeSetupPage[index].url && index !== 1) {
      this.router.navigate(this.employeeSetupPage[index].url);
    } else {
      if (this.userId === undefined) {
        this.employeeSetupPage[1].url = ['/main/employee-setup/employment-details', this.lastSegment];
        this.router.navigate(this.employeeSetupPage[index].url);
      }
      this.router.navigate(this.employeeSetupPage[index].url);
    }
  }

}
