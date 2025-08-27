import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';
import { passwordStrength } from '../validators';
import { showError } from '../../shared/form-messages';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './sign-up.html',
  styleUrls: ['./sign-up.scss']
})
export class SignUpComponent {
  form!: FormGroup;
  showPassword = false;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.form = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, passwordStrength()]],
      terms: [false, [Validators.requiredTrue]]
    });
  }

  get f() { return this.form.controls; }
  err(c: any) { return showError(c); }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  submit() {
  if (this.form.invalid) return;
  try {
    this.auth.register({
      username: this.f['username'].value!,
      email: this.f['email'].value!,
      password: this.f['password'].value!
    });
    this.router.navigateByUrl('/auth/login');
  } catch (e: any) {
    alert(e.message || 'Registration failed');
  }
}

}
