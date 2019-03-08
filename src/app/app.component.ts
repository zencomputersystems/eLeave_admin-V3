import { Component } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],

})
export class AppComponent {
  public showFullMenu: boolean = true;
  public showIconMenu: boolean = false;
  public activeRoute: any;

  public appPages = [
    {
      title: 'Dashboard',
      url: '/dashboard',
      icon: 'desktop'
    },
    {
      title: 'Inbox',
      url: '/inbox',
      icon: 'mail-unread'
    },
    {
      title: 'Plan My Leave',
      url: '/plan-my-leave',
      icon: 'calendar'
    },
    {
      title: 'Employee',
      url: '/employee-setup',
      icon: 'people'
    }
  ];

  get displayFullMenu(): boolean {
    return this.showFullMenu;
  }
  get displayIconMenu(): boolean {
    return this.showIconMenu;
  }

  constructor(
    private menu: MenuController,
    private route: Router,
  ) {
  }

  ngOnInit() {
    this.openAtBeginning();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      for (let i = 0; i < this.appPages.length; i++) {
        if (this.route.url === this.appPages[i].url) {
          this.activeRoute = this.appPages[i].url;
        }
      }
    }, 500);
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
