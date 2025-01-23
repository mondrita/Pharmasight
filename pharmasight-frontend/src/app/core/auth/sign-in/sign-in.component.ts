import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import {ValidateFieldDirective} from "../../../shared/directive/validate-field.directive";
import {AuthService} from "../../../service/auth.service";


@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ValidateFieldDirective],
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css'],
})
export class SignInComponent implements OnInit {
  public regForm!: FormGroup;
  public errorMessage: string = "";

  constructor(
      private fb: FormBuilder,
      private router: Router,
      private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.regForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(4)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSignIn() {
    if (this.regForm.valid) {
      console.log(this.regForm.value);
      this.authService.login(this.regForm.value).subscribe({
        next: (response) => {
          console.log(response);
          localStorage.setItem('token', response.token);
          this.router.navigate(['/leaflet-map']);
        },
        error: (error) => {
          this.errorMessage = 'Please use valid username and password';
          console.error(error);
        },
      });
    }
  }
}
