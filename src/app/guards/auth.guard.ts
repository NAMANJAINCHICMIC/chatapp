import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Route, Router } from '@angular/router';

import { AuthService } from '../services/auth.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) { }
  canActivate(route: ActivatedRouteSnapshot,): boolean {
    const { routeConfig } = route;
    const { path } = routeConfig as Route;

    if ((path?.includes('home') || path?.includes('change-password'))&& !this.authService.isLoggedIn()) {

      return true;
    }
    if ((path?.includes('sign-up') || path?.includes('sign-in')) && !this.authService.isLoggedIn()) {

      // alert("need to log out first!")
      this.router.navigate(['home']);
      return false;
      // return true;
    }
    if ((path?.includes('sign-up') || path?.includes('sign-in')) && this.authService.isLoggedIn()) {

      return true;

    }
    // if (path?.includes('change-password') && !this.authService.isLoggedIn()) {

    //   return true;
    // }


    this.router.navigate(['/']);
    // alert("need to sign in first!")
    return false;

    //   if (path?.includes('sign-in')&&!this.authService.isLoggedIn()){
    //     // console.log("")
    //     return true;
    //   }
    // if(!this.authService.isLoggedIn()){
    //   // this.router.navigate(['home']);
    //   return true;
    // }else{
    //   this.router.navigate(['/']);
    //   // alert("need to sign in first!")
    //     return false;
    //   }
  }
  // canDeactivate():boolean{
  // if(this.authService.isLoggedIn()){
  //   this.router.navigate(['home']);
  //   return true;
  // }else{
  //     return false;
  //   }
  // }

}
