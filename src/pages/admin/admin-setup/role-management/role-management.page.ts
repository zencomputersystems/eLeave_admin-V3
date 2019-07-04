import { Component, OnInit } from '@angular/core';
import { RolesAPIService } from './role-api.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-role-management',
    templateUrl: './role-management.page.html',
    styleUrls: ['./role-management.page.scss'],
})
export class RoleManagementPage implements OnInit {

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
        console.log(roleId);
        this.router.navigate(['/main/role-management/role-rights', roleId]);
    }

}