import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthTwoGuard implements CanActivate {
  constructor(private router: Router , private authService: AuthService){}
  canActivate():boolean{
  if(!this.authService.isLoggedIn()){
    alert("need to log out first!")
    this.router.navigate(['home']);
    return false;
  }else{
      // this.router.navigate(['/']);
      return true;
    }
  }
}
