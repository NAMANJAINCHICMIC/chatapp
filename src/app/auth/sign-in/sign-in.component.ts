import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule , Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule ,Validators} from '@angular/forms';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [RouterModule, CommonModule , ReactiveFormsModule],
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent {
  constructor(private router: Router){}
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
}
