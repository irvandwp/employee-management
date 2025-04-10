import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private readonly validUser = { username: 'admin', password: 'admin123' };

  constructor(private router: Router) {}

  login(username: string, password: string): boolean {
    if (username === this.validUser.username && password === this.validUser.password) {
      this.isAuthenticatedSubject.next(true);
      localStorage.setItem('isAuthenticated', 'true');
      return true;
    }
    return false;
  }

  logout(): void {
    this.isAuthenticatedSubject.next(false);
    localStorage.removeItem('isAuthenticated');
    this.router.navigate(['/login']);
  }

  isAuthenticated(): Observable<boolean> {
    const storedAuth = localStorage.getItem('isAuthenticated');
    if (storedAuth) {
      this.isAuthenticatedSubject.next(true);
    }
    return this.isAuthenticatedSubject.asObservable();
  }
}