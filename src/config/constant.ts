import { InjectionToken } from "@angular/core";
import { IUserProfileConfig } from "src/pages/admin/employee-setup/employee-setup.config";

export const DREAMFACTORY_TABLE_URL = 'http://api.zen.com.my/api/v2/zcs_dev/_table';
export const DREAMFACTORY_API_KEY = 'cb82c1df0ba653578081b3b58179158594b3b8f29c4ee1050fda1b7bd91c3881';
export const LOGIN_AUTHORIZATION_KEY = 'Authorization';
export const LOGIN_AUTHORIZATION_VALUE = 'JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Im5hbWUiOiJzaGFmdWFuIiwidGVuYW50SWQiOiJkZGRkZCJ9LCJpYXQiOjE1NDk4Njc1NDB9.4Ww0-45TubOFUANfCsMRtPRKFJLZ8nbUFOjVmf4gTxM';

// export let APP_CONFIG: InjectionToken<string> = new InjectionToken('app.config');

// export interface IAppConfig {
//     UserProfileConfig: IUserProfileConfig;
// }

// export const AppConfig: IAppConfig = {

//     UserProfileConfig: {
//         LoadUserProfileUrl: 'http://localhost:3000/api/userprofile/list',
//     },


// };
