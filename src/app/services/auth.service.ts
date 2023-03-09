import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { SocialAuthService, SocialUser } from "@abacritt/angularx-social-login";
import { GoogleLoginProvider } from "@abacritt/angularx-social-login";
import { Token } from '@angular/compiler';


// const AUTH_API ='http://192.180.2.159:4040/'
const AUTH_API ='http://192.180.0.192:4040/'
// var headers_object = new HttpHeaders({
//   'Content-Type': 'application/json',
//    'Authorization': "Bearer "+t)
// });
// const tokenValue = localStorage.getItem('token') ;
const httpOptions = {
  headers: new HttpHeaders({
     'Content-Type': 'application/json',
    //  'Authorization': "Bearer "+ tokenValue

})
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
//   private authChangeSub = new Subject<boolean>();
// private extAuthChangeSub = new Subject<SocialUser>();
// public authChanged = this.authChangeSub.asObservable();
// public extAuthChanged = this.extAuthChangeSub.asObservable();

  constructor(private http: HttpClient , private router: Router, private externalAuthService: SocialAuthService) { 
    // this.externalAuthService.authState.subscribe((user) => {
    //   console.log(user)
    //   this.extAuthChangeSub.next(user);
    // })
  }

  login(email: string| null | undefined, password: string| null | undefined): Observable<any> {
    return this.http.post(
      AUTH_API + 'api/v1/UserLogin',
      {
        email,
        password,
      },
      httpOptions
    );
  }

  register(firstName: string| null | undefined,  lastName: string| null | undefined, email: string| null | undefined, password: string| null | undefined,phone: string| null | undefined,dateOfBirth:string| null | undefined): Observable<any> {
    return this.http.post(
      AUTH_API + 'api/v1/RegisterUser',
      {
        firstName,
        lastName,
        email,
        password,
        phone,
        dateOfBirth
      },
      httpOptions
    );
  }

  forgetPassword(email: string| null | undefined): Observable<any> {
    return this.http.post(
      AUTH_API + 'api/v1/forget-password'+ '?email='+email,
      
      httpOptions
    );
  }
  verifyUser(data:any): Observable<any> {
    return this.http.post(
      AUTH_API + 'api/v1/verify',
      data,
      httpOptions
    );
  }
  resetPassword(data:any): Observable<any> {
    return this.http.post(
      AUTH_API + 'api/v1/reset-password',
      data,
      // httpOptions
      {
        headers: new HttpHeaders({
           'Content-Type': 'application/json',
           'Authorization': "Bearer "+ localStorage.getItem('token')
      
      })
      }
    );
  }
  changePassword(data:any): Observable<any> {
    return this.http.post(
      // AUTH_API + 'api/v1/Auth/confirm-password',
      AUTH_API + 'api/v1/change-password',
     data,
      // httpOptions
      {
        headers: new HttpHeaders({
           'Content-Type': 'application/json',
           'Authorization': "Bearer "+ localStorage.getItem('token')
      
      })
      }
    );
  }

  // signInWithGoogle(){
  //   this.externalAuthService.signIn(GoogleLoginProvider.PROVIDER_ID).then((x: any) => console.log(x));
  // }
  // signOutExternal (){
  //   this.externalAuthService.signOut();
  // }

  // logout(): Observable<any> {
  //   return this.http.post(AUTH_API + 'signout', { }, httpOptions);
  // }
  signOut(){
    localStorage.clear();
    this.router.navigate(['/']);
    this.externalAuthService.signOut();
  }
  storeToken(tokenValue:string){
    localStorage.setItem('token',tokenValue)
  }

  getToken(){
    return localStorage.getItem('token')
  }

  isLoggedIn():boolean{
    return !localStorage.getItem('token')
  }
}
