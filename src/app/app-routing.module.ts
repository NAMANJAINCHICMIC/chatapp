import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChangePasswordComponent } from './auth/change-password/change-password.component';
import { ForgetPasswordComponent } from './auth/forget-password/forget-password.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { SignInComponent } from './auth/sign-in/sign-in.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { VerifyUserComponent } from './auth/verify-user/verify-user.component';

import { AuthGuard } from './guards/auth.guard';
// import { HomeComponent } from './home/home.component';
import { PageNotFindComponent } from './page-not-find/page-not-find.component';

const routes: Routes = [
  {
        path: '',
        pathMatch: 'full',
        redirectTo: 'sign-in'
    },
    {
        path: 'sign-in',
        component: SignInComponent,
        canActivate:[AuthGuard]
        // canActivate:[AuthTwoGuard]
    },
    {
        path: 'sign-up',
        component: SignUpComponent,
        canActivate:[AuthGuard]
        // canActivate:[AuthTwoGuard]
    },
    {path:'reset-password',component: ResetPasswordComponent},
    {path:'verify-user',component: VerifyUserComponent},
    {path:'change-password',component:ChangePasswordComponent,  canActivate:[AuthGuard]},
    {path:'forget-password',component:ForgetPasswordComponent},
    {
        path: 'home',
        loadComponent: () => import('./home/home.component')
            .then(m => m.HomeComponent),
            canActivate:[AuthGuard]
    },
    {
        path: '**',
        component: PageNotFindComponent
    }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { 

}
