import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RolesAPIService } from '../role-api.service';

@Component({
    selector: 'app-role-list',
    templateUrl: './role-list.page.html',
    styleUrls: ['./role-list.page.scss'],
})
export class RoleListPage implements OnInit {

    public roleList: any;
    public showSpinner: boolean = true;
    public showContent: boolean = false;

    constructor(private roleAPi: RolesAPIService, private router: Router) { }


    ngOnInit() {
        this.roleAPi.get_role_profile_list().subscribe(data => {
            this.roleList = data;
            this.showSpinner = false;
            this.showContent = true;
        },
            error => {
                if (error) {
                    window.location.href = '/login';
                }
            });
    }

    getRoleId(roleId) {
        this.router.navigate(['/main/role-management/role-rights', roleId]);
    }

    assignRole() {
        this.router.navigate(['/main/role-management/assign-role']);
    }

}