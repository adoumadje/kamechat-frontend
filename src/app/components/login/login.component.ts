import { Component, inject } from '@angular/core';
import { AuthGoogleService } from '../../services/auth-google.service';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  private authService = inject(AuthGoogleService);

  constructor() { }

  login(): void {
    console.log('login');
  }

  signInWithGoogle() {
    this.authService.login();
  }
}
