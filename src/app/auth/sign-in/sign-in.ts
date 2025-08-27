import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup, AbstractControl } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';
import { showError } from '../../shared/form-messages';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './sign-in.html',
  styleUrls: ['./sign-in.scss']
})
export class SignInComponent {
  form!: FormGroup;
  showPassword = false;

  constructor(private fb: FormBuilder, private auth: AuthService) {
    this.form = this.fb.group({
      usernameOrEmail: ['', [Validators.required]],
      password: ['', [Validators.required]],
      remember: [false]
    });
  }

  get f(): { [key: string]: AbstractControl } { return this.form.controls; }
  err(c: any) { return showError(c); }

  togglePassword() { this.showPassword = !this.showPassword; }

  submit() {
    if (this.form.invalid) return;
    const { usernameOrEmail, password, remember } = this.form.getRawValue();
    try {
      this.auth.login(usernameOrEmail!, password!, !!remember);
      alert('Logged in! (demo)');
    } catch (e: any) {
      alert(e.message || 'Login failed');
    }
  }
}
