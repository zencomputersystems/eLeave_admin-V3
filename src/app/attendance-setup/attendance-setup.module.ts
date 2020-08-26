import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';
import { SpinnerModule } from '$admin-root/src/library/spinner/spinner.module';
import { MatTooltipModule, MatDialogModule, MatRadioModule, MatMenuModule, MatSelectModule } from '@angular/material';
import { MatChipsModule } from '@angular/material/chips';
import { BrowserModule } from '@angular/platform-browser';
import { EditorModule } from 'primeng/editor';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AttendanceComponent } from './attendance/attendance.component';
import { DndModule } from 'ngx-drag-drop';
import { ClientComponent } from './client/client.component';
import { InlineSVGModule } from 'ng-inline-svg';
import { AgmCoreModule } from '@agm/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { SupportComponent } from './support/support.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MatIconModule,
    MatCardModule,
    MatListModule,
    MatGridListModule,
    SpinnerModule,
    MatTooltipModule,
    MatChipsModule,
    BrowserModule,
    EditorModule,
    MatInputModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatDialogModule,
    MatRadioModule,
    DndModule,
    MatMenuModule,
    MatSelectModule,
    ReactiveFormsModule,
    InlineSVGModule,
    MatAutocompleteModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyC8vs7sealRJ2NkmPHBeR_ig1gjV7cznOo',
      libraries: ['places']
    })
  ],
  declarations: [AttendanceComponent, ClientComponent, SupportComponent],
  entryComponents: []
})
export class AttendanceSetupModule { }

