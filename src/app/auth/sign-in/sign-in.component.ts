import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { SocialLoginModule, SocialAuthServiceConfig, SocialAuthService, FacebookLoginProvider, SocialUser } from '@abacritt/angularx-social-login';
import {
  GoogleLoginProvider,
  // FacebookLoginProvider
} from '@abacritt/angularx-social-login';
@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, HttpClientModule, SocialLoginModule],
  providers: [HttpClientModule, AuthService,
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '467964487589-fv3ag1cieljsab26l3snjn5ghrfpo2j4.apps.googleusercontent.com'
            )
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider('516188470694250')
          }
        ],
        onError: (err) => {
          console.error(err);
        }
      } as SocialAuthServiceConfig,
    }
  ],
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
        this.http.post<any>('http://192.180.0.192:4040/api/v1/GoogleAuth?Token=' + user.idToken, httpOptions).subscribe((authToken: any) => {
          console.log(authToken);
        })
        this.authService.storeToken(user.idToken);
        this.router.navigate(['home']);
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
            this.router.navigate(['home'], { state: {email: res.data.email } });
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
