import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

/**
 * Role Management page
 * @export
 * @class RoleManagementComponent
 * @implements {OnInit}
 */
@Component({
    selector: 'app-role-management',
    templateUrl: './role-management.component.html',
    styleUrls: ['./role-management.component.scss'],
})
export class RoleManagementComponent implements OnInit {

    /**
     *Creates an instance of RoleManagementComponent.
     * @param {Router} router
     * @memberof RoleManagementComponent
     */
    constructor(public router: Router) {

    }

    ngOnInit() {
    }


}