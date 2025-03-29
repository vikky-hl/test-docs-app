import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule  } from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';

@Component({
  selector: 'app-registration',
  standalone: true,
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss',
  imports: [MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatRadioModule, ReactiveFormsModule]
})
export class RegistrationComponent {
  registrationForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registrationForm = this.fb.group({
      fullName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['USER', [Validators.required]] // Default role is USER
    });
  }

  onSubmit() {
    if (this.registrationForm.valid) {
      const { fullName, email, password, role } = this.registrationForm.value;
      this.authService.register(fullName, email, password, role).subscribe({
        next: (res) => console.log(res),
        error: (err) => console.log(err)
      });
    }
  }
}
