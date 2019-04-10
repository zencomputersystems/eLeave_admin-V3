export class ISideMenu {
  title: string;
  url: string;
  icon: string;
}

import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Router } from '@angular/router';
import { APIService } from 'src/services/shared-service/api.service';

@Component({
  selector: 'app-side-menu-navigation',
  templateUrl: './side-menu-navigation.component.html',
  styleUrls: ['./side-menu-navigation.component.scss']
})
export class SideMenuNavigationComponent implements OnInit {

  public showFullMenu: boolean = true;
  public showIconMenu: boolean = false;
  public activeRoute: any;
  public list: any;
  public appPages: ISideMenu[] = [
    {
      title: 'Dashboard',
      url: '/main/dashboard',
      icon: 'dashboard.svg'
    },
    {
      title: 'Inbox',
      url: '/main/inbox',
      icon: 'inbox.svg'
    },
    {
      title: 'Plan My Leave',
      url: '/main/plan-my-leave',
      icon: 'my_leave.svg'
    },
    {
      title: 'Employee',
      url: '/main/employee-directory',
      icon: 'employee.svg'
    }
  ];

  get personalList(): any {
    return this.list;
  }
  get displayFullMenu(): boolean {
    return this.showFullMenu;
  }
  get displayIconMenu(): boolean {
    return this.showIconMenu;
  }

  constructor(private menu: MenuController, private route: Router,
    private apiService: APIService
  ) {
  }

  ngOnInit() {
    for (let i = 0; i < this.appPages.length; i++) {
      if (this.route.url === this.appPages[i].url) {
        this.activeRoute = this.appPages[i].url;
      }
    }
    this.openAtBeginning();
    this.apiService.get_personal_details().subscribe(data => {
      // this.userId = data.id;
      this.list = data;
    });
  }

  openAtBeginning() {
    if (this.displayFullMenu === true) {
      this.menu.open('first');
    }
  }

  collapseMenu() {
    this.showFullMenu = false;
    this.showIconMenu = true;
    this.menu.enable(false, 'first');
    this.menu.close('first');
    this.menu.enable(true, 'custom');
    setTimeout(() => {
      this.menu.open('custom');
    }, 10);
  }

  expandMenu() {
    this.showFullMenu = true;
    this.showIconMenu = false;
    this.menu.enable(true, 'first');
    this.menu.enable(false, 'custom');
    this.menu.close('custom');
    setTimeout(() => {
      this.menu.open('first');
    }, 10);
  }

  fullMenuClosedHandler() {
    this.menu.open('first');
  }

  iconMenuClosedHandler() {
    this.menu.open('custom');
  }

}
