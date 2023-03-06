import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChangePasswordComponent } from './auth/change-password/change-password.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { SignInComponent } from './auth/sign-in/sign-in.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
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
        component: SignInComponent
    },
    {
        path: 'sign-up',
        component: SignUpComponent
    },
    {path:'reset-password',component: ResetPasswordComponent},
    {path:'change-password',component:ChangePasswordComponent},
    {
        path: 'home',
        loadComponent: () => import('./home/home.component')
            .then(m => m.HomeComponent)
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
