import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  email = '';
  password = '';
  errorMessage = '';

  constructor(private authService: AuthService) {}

  async onLogin(): Promise<void> {
    const success = await this.authService.login(this.email, this.password);
    if (!success) {
      this.errorMessage = 'Credenciales incorrectas. (Intente admin@gloria.com o operador@gloria.com)';
    }
  }
}
