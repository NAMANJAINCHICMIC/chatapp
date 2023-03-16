import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { SocialAuthService, SocialUser } from "@abacritt/angularx-social-login";
import { GoogleLoginProvider } from "@abacritt/angularx-social-login";
import { Token } from '@angular/compiler';
import { ChatService } from './chat.service';


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

  constructor(private http: HttpClient , private router: Router, private externalAuthService: SocialAuthService , private chatService: ChatService) { 
    // this.externalAuthService.authState.subscribe((user) => {
    //   console.log(user)
    //   this.extAuthChangeSub.next(user);
    // })
  }

  login(email: string| null | undefined, password: string| null | undefined): Observable<any> {
    return this.http.post(
      AUTH_API + 'api/v1/user/login',
      {
        email,
        password,
      },
      httpOptions
    );
  }

  register(firstName: string| null | undefined,  lastName: string| null | undefined, email: string| null | undefined, password: string| null | undefined,phone: string| null | undefined,dateOfBirth:string| null | undefined): Observable<any> {
    return this.http.post(
      AUTH_API + 'api/v1/user/register',
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
      AUTH_API + 'api/v1/forgetPassword'+ '?email='+email,
      
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
  resetPassword(otp: string| null | undefined,password: string| null | undefined,): Observable<any> {
    return this.http.post(
      AUTH_API + 'api/v1/resetPassword',
      {otp,password},
      // httpOptions
      {
        headers: new HttpHeaders({
           'Content-Type': 'application/json',
           'Authorization': "Bearer "+ localStorage.getItem('resetToken')
      
      })
      }
    );
  }
  changePassword(oldPassword: string| null | undefined,password: string| null | undefined): Observable<any> {
    return this.http.post(
      // AUTH_API + 'api/v1/Auth/confirm-password',
      AUTH_API + 'api/v1/changePassword',
     {
      oldPassword,password
     },
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

  logout(): Observable<any> {
    return this.http.post(AUTH_API + 'api/v1/user/logout', { }, {
      headers: new HttpHeaders({
         'Content-Type': 'application/json',
         'Authorization': "Bearer "+ localStorage.getItem('token')
    
    })
    });
  }
  signOut(){
    this.logout().subscribe(
      (res)=>{
      console.log(res);
      alert(res.message);
      if (res.success){ 
        this.externalAuthService.signOut();
        this.chatService.stopChatConnection();
        localStorage.clear();
        this.router.navigate(['/']);
      }}
    );
    // localStorage.clear();
    // this.router.navigate(['/']);
    // this.externalAuthService.signOut();
    // return this.http.post(AUTH_API + 'api/v1/user/logout', { }, {
    //   headers: new HttpHeaders({
    //      'Content-Type': 'application/json',
    //      'Authorization': "Bearer "+ localStorage.getItem('token')
    
    // })
    // });
  }
  storeToken(tokenValue:string){
    localStorage.setItem('token',tokenValue)
  }

  getToken(){
    return localStorage.getItem('token')
  }

  storeResetToken(tokenValue:string){
    localStorage.setItem('resetToken',tokenValue)
  }

  getResetToken(){
    return localStorage.getItem('resetToken')
  }

  isLoggedIn():boolean{
    return !localStorage.getItem('token')
  }
}
