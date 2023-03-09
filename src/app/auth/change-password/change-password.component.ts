import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, Validators , ReactiveFormsModule} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [RouterModule, CommonModule , ReactiveFormsModule],
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent {
  passwordsMatching = false;
  isConfirmPasswordDirty = false;
  confirmPasswordClass = 'form-control';
  showError= false;
  constructor(private router: Router,private authService: AuthService ){}
  changePasswordForm = new FormGroup(
    {
      oldPassword: new FormControl('', Validators.required),
      password: new FormControl('',[Validators.required , Validators.minLength(8)]),
      confirmPassword: new FormControl('',[Validators.required , Validators.minLength(8)]),
     
    }
  )
get controlName(){
  return this.changePasswordForm.controls;
}
visibleOldPassword=true;
visibleNewPassword=true;
visibleConfirmPassword=true;
viewOldPassword(){
  this.visibleOldPassword = !this.visibleOldPassword;
}
viewNewPassword(){
  this.visibleNewPassword = !this.visibleNewPassword;
}
viewConfirmPassword(){
  this.visibleConfirmPassword = !this.visibleConfirmPassword;
}

onSubmit(){
  if (this.changePasswordForm.valid) {
    console.log('form submitted');
  // const { email} = this.changePasswordForm.value
  console.log(this.changePasswordForm.value);
  // this.http.post('http://192.180.2.159:4040/api/v1/RegisterUser',this.registrationForm.value)
  this.authService.changePassword(this.changePasswordForm.value).subscribe(
    (res)=>{
    console.log(res);
    this.changePasswordForm.reset();
    // this.authService.storeToken(res.data );
    this.router.navigate(['home']);
    }
  );
} else {
  // validate all form fields
  console.log("show errors")
  this.showError = true;
}
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
