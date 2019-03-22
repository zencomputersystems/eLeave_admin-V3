import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConnectionsPage } from 'src/pages/admin/employee-setup/connections/connections.page';
import { LoginComponent } from 'src/pages/login/login.component';
import { PageNotFoundComponent } from './page-not-found.component';
import { SideMenuNavigationComponent } from './side-menu-navigation/side-menu-navigation.component';


const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: 'main', pathMatch: 'full' },
  // { path: '**', component: PageNotFoundComponent },
  // {
  //   path: 'dashboard',
  //   loadChildren: './home/home.module#HomePageModule'
  // },
  // {
  //   path: 'inbox',
  //   loadChildren: './home/home.module#HomePageModule'
  // },
  // {
  //   path: 'plan-my-leave',
  //   loadChildren: './home/home.module#HomePageModule'
  // },
];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
