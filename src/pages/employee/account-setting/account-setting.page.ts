import { Component, OnInit, ElementRef, Renderer } from '@angular/core';
import { APIService } from 'src/services/shared-service/api.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-account-setting',
    templateUrl: './account-setting.page.html',
    styleUrls: ['./account-setting.page.scss'],
})
export class AccountSettingPage implements OnInit {

    private subscription: Subscription = new Subscription();

    constructor(private apiService: APIService) { }

    ngOnInit() {
        this.subscription = this.apiService.get_user_profile_list().subscribe(
            (data: any[]) => {
                // this.employeeList = data;
            },
            error => {
                if (error) {
                    window.location.href = '/login';
                }
            }
        );

    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}