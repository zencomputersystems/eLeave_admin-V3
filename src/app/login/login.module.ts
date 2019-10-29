import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { LoginComponent } from './login.component';
import { NgxSpinnerModule } from "ngx-spinner";
import { AngularWebStorageModule } from 'angular-web-storage';


const routes: Routes = [
    {
        path: '',
        component: LoginComponent
    }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        MatInputModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        MatIconModule,
        NgxSpinnerModule,
        AngularWebStorageModule,
        RouterModule.forChild(routes)
    ],
    declarations: [LoginComponent]
})
export class LoginModule { }

