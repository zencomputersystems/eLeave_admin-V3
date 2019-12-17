export interface ISideMenu {
  /**
   * This is local interface property as title of menu
   * @type {string}
   * @memberof ISideMenu
   */
  title: string;

  /**
   * This is local interface property as url of menu
   * @type {string}
   * @memberof ISideMenu
   */
  url: string;

  /**
   * This is local interface property as icon of menu
   * @type {string}
   * @memberof ISideMenu
   */
  icon: string;
}

import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Router } from '@angular/router';
import { APIService } from 'src/services/shared-service/api.service';
/**
 * Side Menu Navigation Component
 * @export
 * @class SideMenuNavigationComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'app-side-menu-navigation',
  templateUrl: './side-menu-navigation.component.html',
  styleUrls: ['./side-menu-navigation.component.scss']
})
export class SideMenuNavigationComponent implements OnInit {
  /**
   * This is local property to show full menu
   * @type {boolean}
   * @memberof SideMenuNavigationComponent
   */
  public showFullMenu: boolean = true;

  /**
   * This is local property to small icon menu
   * @type {boolean}
   * @memberof SideMenuNavigationComponent
   */
  public showIconMenu: boolean = false;

  /**
   * This is local property to determine active route after clicked on menu
   * @type {*}
   * @memberof SideMenuNavigationComponent
   */
  public activeRoute: any;

  /**
   * This is local property to get personal details from API endpoint
   * @type {*}
   * @memberof SideMenuNavigationComponent
   */
  public list: any;

  /**
   * This is local property to show list of menu, url & icon name
   * @type {ISideMenu[]}
   * @memberof SideMenuNavigationComponent
   */
  public appPages: ISideMenu[] = [
    {
      title: 'Dashboard',
      url: '/main/dashboard',
      icon: 'icon_dashboard@3x.png'
    },
    {
      title: 'Leave Setup',
      url: '/main/leave-setup',
      icon: 'icon_calendar@3x.png'
    },
    {
      title: 'Employee Setup',
      url: '/main/employee-setup',
      icon: 'icon_persons@3x.png'
    },
    {
      title: 'Role Management',
      url: '/main/role-management',
      icon: 'icon_setting@3x.png'
    },
    {
      title: 'Apply on Behalf',
      url: '/main/apply-on-behalf',
      icon: 'icon_customers@3x.png'
    },
    {
      title: 'Approval Override',
      url: '/main/approval-override',
      icon: 'icon_persons@3x.png'
    },
    {
      title: 'Year End Closing',
      url: '/main/year-end-closing',
      icon: 'icon_calendar@3x.png'
    },
    {
      title: 'Report',
      url: '/main/report',
      icon: 'icon_calendar@3x.png'
    }
  ];

  /** 
   * This method used to get return value from property list
   * @readonly
   * @type {*}
   * @memberof SideMenuNavigationComponent
   */
  get personalList(): any {
    return this.list;
  }

  /**
   * This method used to get return value from property showFullMenu
   * @readonly
   * @type {boolean}
   * @memberof SideMenuNavigationComponent
   */
  get displayFullMenu(): boolean {
    return this.showFullMenu;
  }

  /**
   * This method used to get return value from property showIconMenu
   * @readonly
   * @type {boolean}
   * @memberof SideMenuNavigationComponent
   */
  get displayIconMenu(): boolean {
    return this.showIconMenu;
  }

  /**
   *Creates an instance of SideMenuNavigationComponent.
   * @param {MenuController} menu
   * @param {Router} router
   * @param {APIService} apiService
   * @memberof SideMenuNavigationComponent
   */
  constructor(private menu: MenuController, private router: Router,
    private apiService: APIService
  ) { }

  /**
   * This method used to get initial value from personal details API json data
   * Open full menu
   * Get active route
   * @memberof SideMenuNavigationComponent
   */
  ngOnInit() {
    if (this.router.url.split("/").length == 4) {
      const url = this.router.url.split('/');
      const lastSegment = url.pop();
      this.activeUrl(url.join('/'));
    } else {
      this.activeUrl(this.router.url);
    }

    this.openAtBeginning();
    this.apiService.get_personal_details().subscribe(data => {
      this.list = data;
    });
  }

  /**
   * show active route highlight in menu 
   * @param {string} currentRoute
   * @memberof SideMenuNavigationComponent
   */
  activeUrl(currentRoute: string) {
    for (let i = 0; i < this.appPages.length; i++) {
      if (currentRoute === this.appPages[i].url) {
        this.activeRoute = this.appPages[i].url;
      }
    }
  }

  /**
   * This method used to open full menu
   * @memberof SideMenuNavigationComponent
   */
  openAtBeginning() {
    if (this.displayFullMenu === true) {
      this.menu.open('first');
    }
  }

  /**
   * This method used to collapse full menu and expand icon menu
   * @memberof SideMenuNavigationComponent
   */
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

  /**
   * This method used to expand full menu and collapse icon menu
   * @memberof SideMenuNavigationComponent
   */
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

  /**
   * This method is used to open full menu
   * @memberof SideMenuNavigationComponent
   */
  fullMenuClosedHandler() {
    this.menu.open('first');
  }

  /**
   * This method is used to open icon menu
   * @memberof SideMenuNavigationComponent
   */
  iconMenuClosedHandler() {
    this.menu.open('custom');
  }

  /**
   * This method is used to route to Login page after clicked logout button
   * @param {*} event
   * @memberof SideMenuNavigationComponent
   */
  logout(event) {
    window.location.href = '/login';
    localStorage.clear();
  }

}
