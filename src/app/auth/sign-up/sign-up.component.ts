import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule ,Router} from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule ,Validators} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import {HttpClient, HttpClientModule}from '@angular/common/http';


@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [CommonModule ,RouterModule, ReactiveFormsModule, HttpClientModule],
  providers: [ HttpClientModule, AuthService  ],
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {
  visible=true;
  showError= false;
  viewPassword(){
    this.visible = !this.visible;
  }
  constructor(private router: Router , private http: HttpClient,private authService: AuthService){}
  
  form: any = {
    firstName: null,
    lastName: null,
    email: null,
    password: null,
    phone:null,
    dateOfBirth:null
  };
  registrationForm = new FormGroup(
    {
      firstName: new FormControl('', [Validators.required , Validators.minLength(3)]),
      lastName: new FormControl('', [Validators.required , Validators.minLength(3)]),
      email: new FormControl('', [Validators.required,Validators.email]),
      phone: new FormControl('',[Validators.required , Validators.minLength(10), Validators.maxLength(12)]),
      password: new FormControl('',[Validators.required , Validators.minLength(8)]),
      dateOfBirth: new FormControl('', Validators.required),
    }
  )
get controlName(){
  return this.registrationForm.controls;
}
onClick(){
  this.router.navigateByUrl("/sign-in");
}
onSubmit(){
  if (this.registrationForm.valid) {
    console.log('form submitted');

  const { firstName , lastName, email, password,phone,dateOfBirth} = this.registrationForm.value
  console.log(this.registrationForm.value);

  this.authService.register(firstName, lastName, email, password,phone,dateOfBirth).subscribe(
    (res)=>{
      console.log(res)
      this.registrationForm.reset();
      this.authService.storeToken(res.data );
      this.router.navigate(['home']);
    }
  );
  // this.authService.register(this.registrationForm.value).subscribe();
} else {
  // validate all form fields
  console.log("show errors")
  this.showError = true;
}
}


}
