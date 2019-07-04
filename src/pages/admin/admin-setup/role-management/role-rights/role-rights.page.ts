import { Component, OnInit } from '@angular/core';
import { RolesAPIService } from '../role-api.service';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-role-rights',
    templateUrl: './role-rights.page.html',
    styleUrls: ['./role-rights.page.scss'],
})
export class RoleRightsPage implements OnInit {

    public profileDetails: any;
    public showSpinner: boolean = true;
    public showContent: boolean = false;
    private _roleId: string;

    constructor(private roleAPi: RolesAPIService, private route: ActivatedRoute) {
        route.params.subscribe(params => {
            this._roleId = params.id;
        });
    }


    ngOnInit() {
        this.roleAPi.get_role_details_profile(this._roleId).subscribe(data => {
            this.profileDetails = data;
            console.log(this.profileDetails);
            this.showSpinner = false;
            this.showContent = true;
        });
    }

}