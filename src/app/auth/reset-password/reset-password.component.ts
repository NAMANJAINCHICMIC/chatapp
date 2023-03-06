import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, Validators , ReactiveFormsModule} from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [RouterModule, CommonModule , ReactiveFormsModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {
  resetForm = new FormGroup(
    {
      newPassword: new FormControl('',[Validators.required ]),
      comfirmPassword: new FormControl('',[Validators.required ]),
     
    }
  )
get controlName(){
  return this.resetForm.controls;
}
}
