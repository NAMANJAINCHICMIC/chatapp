import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, Validators , ReactiveFormsModule} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-verify-user',
  standalone: true,
  imports: [RouterModule, CommonModule , ReactiveFormsModule],
  templateUrl: './verify-user.component.html',
  styleUrls: ['./verify-user.component.css']
})
export class VerifyUserComponent {

    constructor(private router: Router,private authService: AuthService ){}
    verifyForm = new FormGroup(
      {
        email: new FormControl('', [Validators.required,Validators.email]),
        value:new FormControl('', [Validators.required]),
      }
    )
  get controlName(){
    return this.verifyForm.controls;
  }
  onSubmit(){
    const { email,value} = this.verifyForm.value
    console.log(this.verifyForm.value);
    // this.http.post('http://192.180.2.159:4040/api/v1/RegisterUser',this.registrationForm.value)
    this.authService.verifyUser(this.verifyForm.value).subscribe(
      (res)=>{
      console.log(res);
      this.verifyForm.reset();
      this.authService.storeToken(res.data );
      this.router.navigate(['reset-password']);
      }
    );
    // this.authService.register(this.registrationForm.value).subscribe();
  }
}