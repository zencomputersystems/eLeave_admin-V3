/**
 * side menu interface 
 * @export
 * @interface ISideMenu
 */
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

  /**
   * show/hide menu 
   * @type {boolean}
   * @memberof ISideMenu
   */
  show: boolean;
}

import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { APIService } from '../../../src/services/shared-service/api.service';
import { filter } from 'rxjs/operators';
import { SharedService } from '../admin-setup/leave-setup/shared.service';
import { RouteDialogComponent } from '../admin-setup/leave-setup/route-dialog/route-dialog.component';
import { RoleApiService } from '../admin-setup/role-management/role-api.service';

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
   * emitted toggle value
   * @type {string}
   * @memberof SideMenuNavigationComponent
   */
  public emittedData: string;

  /**
   * get personal profile picture
   * @type {*}
   * @memberof SideMenuNavigationComponent
   */
  public url: any;

  /**
   * This is local property to show list of menu, url & icon name
   * @type {ISideMenu[]}
   * @memberof SideMenuNavigationComponent
   */
  public appPages: ISideMenu[] = [
    {
      title: 'Dashboard',
      url: '/administration/dashboard',
      icon: 'icon_dashboard@3x.png',
      show: true
    },
    {
      title: 'Leave Setup',
      url: '/administration/leave-setup',
      icon: 'icon_calendar@3x.png',
      show: true
    },
    {
      title: 'Employee Setup',
      url: '/administration/employee-setup',
      icon: 'icon_persons@3x.png',
      show: true
    },
    {
      title: 'Role Management',
      url: '/administration/role-management',
      icon: 'icon_setting@3x.png',
      show: true
    },
    {
      title: '',
      url: '',
      icon: '',
      show: true
    },
    {
      title: 'Apply on Behalf',
      url: '/administration/apply-on-behalf',
      icon: 'icon_customers@3x.png',
      show: true
    },
    {
      title: 'Approval Override',
      url: '/administration/approval-override',
      icon: 'icon_persons@3x.png',
      show: true
    },
    {
      title: 'Year End Closing',
      url: '/administration/year-end-closing',
      icon: 'icon_calendar@3x.png',
      show: true
    },
    {
      title: 'Reports',
      url: '/administration/report',
      icon: 'icon_reports@3x.png',
      show: true
    },
    {
      title: '',
      url: '',
      icon: '',
      show: true
    },
    {
      title: 'Attendance Setup',
      url: '/administration/attendance',
      icon: 'icon_calendar@3x.png',
      show: true
    },
    {
      title: 'Client Setup',
      url: '/administration/client',
      icon: 'icon_persons@3x.png',
      show: true
    },
    {
      title: 'Support Center',
      url: '/administration/support',
      icon: 'icon_chat-room@2x.png',
      show: true
    }
  ];

  public image: string = "assets/icon/beesuite.png";

  public imageName: string;

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
   * @param {Router} router
   * @param {APIService} apiService
   * @param {SharedService} sharedService
   * @memberof SideMenuNavigationComponent
   */
  constructor(private router: Router, private apiService: APIService, private roleService: RoleApiService, public sharedService: SharedService
  ) {
    this.imageName = this.image.substring(this.image.lastIndexOf('/') + 1).split('.')[0];
    router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.getRoute(event.urlAfterRedirects);
        this.apiService.get_profile_pic('personal').subscribe(data => {
          this.url = data;
        })
        this.getRoleData();
      });

    sharedService.changeEmitted$.subscribe(
      data => {
        this.emittedData = data;
      });
  }

  /**
   * This method used to get initial value from personal details API json data
   * Open full menu
   * Get active route
   * @memberof SideMenuNavigationComponent
   */
  async ngOnInit() {
    this.getRoute(this.router.url);
    this.openAtBeginning();
  }

  /**
   * get route to highlight active route
   * @param {*} URL
   * @memberof SideMenuNavigationComponent
   */
  async getRoute(URL) {
    if (URL.split("/").length == 4) {
      const url = URL.split('/');
      const lastSegment = url.pop();
      this.activeRoute = url.join('/');
    } else {
      this.activeRoute = URL;
    }
  }

  /**
   * show active route highlight in menu 
   * @param {string} currentRoute
   * @memberof SideMenuNavigationComponent
   */
  activeUrl(currentRoute: string) {
    if (this.emittedData == 'OFF' || this.emittedData == null) {
      this.router.navigate([currentRoute]);
      this.activeRoute = currentRoute;
    } else {
      this.sharedService.dialog.open(RouteDialogComponent, {
        disableClose: true,
        width: "283px",
        height: "194px"
      });
    }
  }

  /**
   * This method used to open full menu
   * @memberof SideMenuNavigationComponent
   */
  openAtBeginning() {
    if (this.displayFullMenu === true) {
      this.expandMenu();
      this.onResize();
    }
  }

  /**
   * This method used to collapse full menu and expand icon menu
   * @memberof SideMenuNavigationComponent
   */
  collapseMenu() {
    this.showFullMenu = false;
    this.showIconMenu = true;
    this.sharedService.menu.enable(false, 'first');
    this.sharedService.menu.close('first');
    this.sharedService.menu.enable(true, 'custom');
    setTimeout(() => {
      this.sharedService.menu.open('custom');
    }, 10);
  }

  /**
   * This method used to expand full menu and collapse icon menu
   * @memberof SideMenuNavigationComponent
   */
  expandMenu() {
    this.showFullMenu = true;
    this.showIconMenu = false;
    this.sharedService.menu.enable(true, 'first');
    this.sharedService.menu.enable(false, 'custom');
    this.sharedService.menu.close('custom');
    setTimeout(() => {
      this.sharedService.menu.open('first');
    }, 10);
  }

  async getRoleData() {
    let data = await this.apiService.get_personal_details().toPromise();
    this.list = data;
    let value = await this.apiService.get_user_profile_details(this.list.userId).toPromise();
    let details = await this.roleService.get_role_details_profile(value.roleId).toPromise();
    if (details.property.allowLeaveSetup.allowLeaveTypeSetup.value === false) {
      this.appPages[1].show = false;
    }
    if (details.property.allowProfileManagement.allowViewProfile.value === false) {
      this.appPages[2].show = false;
    }
    if (details.property.allowLeaveManagement.allowApplyOnBehalf.value === false) {
      this.appPages[5].show = false;
    }
    if (details.property.allowLeaveManagement.allowApprovalOverride.value === false) {
      this.appPages[6].show = false;
    }
    if (details.property.allowLeaveSetup.allowYearEndClosingSetup.value === false) {
      this.appPages[7].show = false;
    }
    if (details.property.allowViewReport.value === false) {
      this.appPages[8].show = false;
    }
  }

  /**
   * This method is used to route to Login page after clicked logout button
   * @param {*} event
   * @memberof SideMenuNavigationComponent
   */
  logout(event) {
    window.location.href = '/';
    // this.router.navigate(['/']);
    localStorage.clear();
  }

  /**
   * This method is used to check window inner width. Once the width < 992px,
   * it will collapse side menu nav bar
   * @memberof SideMenuNavigationComponent
   */
  onResize() {
    if (window.innerWidth < 992) {
      this.collapseMenu();
    }
  }

  routeTo() {
    this.router.navigate(['/main'])
      .then(() => {
        location.reload();
      });
  }

}
