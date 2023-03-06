import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule , Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule ,Validators} from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [RouterModule, CommonModule , ReactiveFormsModule],
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent {
  constructor(private router: Router,private authService: AuthService){}
  loginForm = new FormGroup(
    {
    
      email: new FormControl('', Validators.required),
     
      password: new FormControl('',[Validators.required ]),
     
    }
  )
get controlName(){
  return this.loginForm.controls;
}
onClick(){
  this.router.navigateByUrl("/sign-up");
}

onSubmit(){
  let { email, password} = this.loginForm.value
  console.log(this.loginForm.value);
  // this.http.post('http://192.180.2.159:4040/api/v1/RegisterUser',this.registrationForm.value)
  this.authService.login(email, password).subscribe(
    (res)=>console.log(res)
  );
  // this.authService.register(this.registrationForm.value).subscribe();
}
}
