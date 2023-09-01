import { SocialUser, SocialAuthService, GoogleLoginProvider, FacebookLoginProvider } from '@abacritt/angularx-social-login';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {

  private accessToken = '';
  user?: SocialUser | null;
  loggedIn?: boolean;
  showError = false;
  constructor(private http: HttpClient, private router: Router, private authService: AuthService, private socialAuthService: SocialAuthService) {
    this.user = null;

    this.socialAuthService.authState.subscribe((user: SocialUser) => {
      console.log(user);

      if (user) {
        const httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            //  'Authorization': "Bearer "+ user.idToken

          })
        }
        this.http.post('http://192.180.0.192:4040/api/v1/GoogleAuth?Token=' + user.idToken, httpOptions).subscribe((authToken: any) => {
          console.log(authToken);
          this.authService.storeToken(authToken?.data?.token);
          this.authService.storeEmail(user.email);
          this.router.navigate(['home']);
        })
      }
      this.user = user;
    });
  }
  loginForm = new FormGroup(
    {

      email: new FormControl('', [Validators.required, Validators.email]),

      password: new FormControl('',[Validators.required , Validators.minLength(8),Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$")]),

    }
  )

  ngOnInit() {
    this.socialAuthService.authState.subscribe((user) => {
      this.user = user;
      this.loggedIn = (user != null);
    });
  }

  get controlName() {
    return this.loginForm.controls;
  }
  onClick() {
    this.router.navigateByUrl("/sign-up");
  }
  onClickForget() {
    this.router.navigateByUrl("/forget-password");
  }


  onSubmit() {
    if (this.loginForm.valid) {
      console.log('form submitted');

      const { email, password } = this.loginForm.value
      console.log(this.loginForm.value);
      // this.http.post('http://192.180.2.159:4040/api/v1/RegisterUser',this.registrationForm.value)
      this.authService.login(email, password).subscribe(
        (res) => {
          console.log(res);
          alert(res.message);
          if (res.success) {

            this.loginForm.reset();
            this.authService.storeToken(res.data.token);
            this.authService.storeEmail(res.data.email);
            this.router.navigate(['home']);
          }
        }
      );
      // this.authService.register(this.registrationForm.value).subscribe();
    } else {
      // validate all form fields
      console.log("show errors")
      this.showError = true;
    }

  }
  visible = true;
  viewPassword() {
    this.visible = !this.visible;
  }
  // externalLogin(){

  //   this.authService.signInWithGoogle();
  // }
  refreshToken(): void {
    this.socialAuthService.refreshAuthToken(GoogleLoginProvider.PROVIDER_ID);
  }
  // getAccessToken(): void {
  //   this.socialAuthService.getAccessToken(GoogleLoginProvider.PROVIDER_ID).then(accessToken => this.accessToken = accessToken);
  // }
  signInWithGoogle(): void {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID).then((x: any) => console.log(x));
  }
  signInWithFB(): void {
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID).then((x: any) => console.log(x));
  }

  signOut(): void {
    this.socialAuthService.signOut();
  }

  getAccessToken(): void {
    this.socialAuthService.getAccessToken(GoogleLoginProvider.PROVIDER_ID).then(accessToken => this.accessToken = accessToken);
  }

}
