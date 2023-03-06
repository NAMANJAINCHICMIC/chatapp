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
  providers: [ HttpClientModule, AuthService],
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {
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
      email: new FormControl('', Validators.required),
      phone: new FormControl('',[Validators.required , Validators.minLength(10)]),
      password: new FormControl('',[Validators.required , Validators.minLength(6)]),
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
  let { firstName , lastName, email, password,phone,dateOfBirth} = this.registrationForm.value
  console.log(this.registrationForm.value);
  // this.http.post('http://192.180.2.159:4040/api/v1/RegisterUser',this.registrationForm.value)
  this.authService.register(firstName, lastName, email, password,phone,dateOfBirth).subscribe(
    (res)=>console.log(res)
  );
  // this.authService.register(this.registrationForm.value).subscribe();
}

}
