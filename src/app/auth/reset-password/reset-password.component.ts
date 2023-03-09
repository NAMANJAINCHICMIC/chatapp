import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, Validators , ReactiveFormsModule} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [RouterModule, CommonModule , ReactiveFormsModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {
  passwordsMatching = false;
  isConfirmPasswordDirty = false;
  confirmPasswordClass = 'form-control';

  constructor(private router: Router,private authService: AuthService ){}
  resetForm = new FormGroup(
    {
      password: new FormControl('',[Validators.required , Validators.minLength(8)]),
      confirmPassword: new FormControl('',[Validators.required , Validators.minLength(8)]),
     
    }
  )
get controlName(){
  return this.resetForm.controls;
}

visibleNewPassword=true;
visibleConfirmPassword=true;

viewNewPassword(){
  this.visibleNewPassword = !this.visibleNewPassword;
}
viewConfirmPassword(){
  this.visibleConfirmPassword = !this.visibleConfirmPassword;
}
onSubmit(){
  // const { email} = this.resetForm.value
  console.log( this.authService.getToken())
  console.log(this.resetForm.value);
  // this.http.post('http://192.180.2.159:4040/api/v1/RegisterUser',this.registrationForm.value)
  this.authService.resetPassword(this.resetForm.value).subscribe(
    (res)=>{
    console.log(res);
    this.resetForm.reset();
    // this.authService.storeToken(res.data );
    
    this.router.navigate(['home']);
    }
  );
  // this.authService.register(this.registrationForm.value).subscribe();
}
checkPasswords(pw: string, cpw: string) {
  this.isConfirmPasswordDirty = true;
  if (pw == cpw) {
    this.passwordsMatching = true;
    this.confirmPasswordClass = 'form-control is-valid';
  } else {
    this.passwordsMatching = false;
    this.confirmPasswordClass = 'form-control is-invalid';
  }
}
}
