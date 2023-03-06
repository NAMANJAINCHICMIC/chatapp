import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule ,Router} from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule ,Validators} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import {HttpClient, HttpClientModule}from '@angular/common/http';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [CommonModule ,RouterModule, ReactiveFormsModule,HttpClientModule],
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
    mobile:null,
    dob:null
  };
  registrationForm = new FormGroup(
    {
      firstName: new FormControl('', [Validators.required , Validators.minLength(3)]),
      lastName: new FormControl('', [Validators.required , Validators.minLength(3)]),
      email: new FormControl('', Validators.required),
      mobile: new FormControl('',[Validators.required , Validators.minLength(10)]),
      password: new FormControl('',[Validators.required , Validators.minLength(6)]),
      dob: new FormControl('', Validators.required),
    }
  )
get controlName(){
  return this.registrationForm.controls;
}
onClick(){
  this.router.navigateByUrl("/sign-in");
}
onSubmit(){
  console.log(this.registrationForm.value);
  // return this.http.post('http://192.180.2.159:4040/swagger/index.html/api/v1/RegisterUser',this.registrationForm)
  // this.authService.register(firstName ,  lastName: string, email: string, password: string,phone:number,dateOfBirth:string).subscribe();
}

}
