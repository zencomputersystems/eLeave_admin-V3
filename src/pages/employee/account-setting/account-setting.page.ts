import { Component, OnInit, ElementRef, Renderer } from '@angular/core';
import { APIService } from 'src/services/shared-service/api.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-account-setting',
    templateUrl: './account-setting.page.html',
    styleUrls: ['./account-setting.page.scss'],
})
export class AccountSettingPage implements OnInit {

    constructor(private apiService: APIService, private router: Router) { }

    ngOnInit() {
        this.apiService.get_user_profile_list().subscribe(
            (data: any[]) => {
                // this.employeeList = data;
            },
            error => {
                if (error) {
                    location.reload;
                    this.router.navigate(['/login']);
                }
            }
        );

    }
}