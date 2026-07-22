import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private router: Router) {}

  async login(email: string, pass: string): Promise<boolean> {
    try {
      const res = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass })
      });
      
      if (!res.ok) return false;

      const data = await res.json();
      localStorage.setItem('userToken', data.token);
      localStorage.setItem('userRole', data.usuario.rol);
      
      if (data.usuario.rol === 'admin') {
        this.router.navigate(['/dashboard']);
      } else {
        this.router.navigate(['/operador-dashboard']);
      }
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  logout(): void {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userRole');
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('userToken');
  }

  getRole(): string | null {
    return localStorage.getItem('userRole');
  }
}