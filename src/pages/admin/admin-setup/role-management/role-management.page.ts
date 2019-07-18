import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

/**
 * Role Management page
 * @export
 * @class RoleManagementPage
 * @implements {OnInit}
 */
@Component({
    selector: 'app-role-management',
    templateUrl: './role-management.page.html',
    styleUrls: ['./role-management.page.scss'],
})
export class RoleManagementPage implements OnInit {

    /**
     *Creates an instance of RoleManagementPage.
     * @param {Router} router
     * @memberof RoleManagementPage
     */
    constructor(private router: Router) {

    }

    ngOnInit() {
    }


}