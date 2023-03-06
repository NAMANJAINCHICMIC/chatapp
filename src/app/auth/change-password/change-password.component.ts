import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, Validators , ReactiveFormsModule} from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [RouterModule, CommonModule , ReactiveFormsModule],
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent {
 
  resetForm = new FormGroup(
    {
      oldPassword: new FormControl('', Validators.required),
      newPassword: new FormControl('',[Validators.required ]),
      comfirmPassword: new FormControl('',[Validators.required ]),
     
    }
  )
get controlName(){
  return this.resetForm.controls;
}
}
