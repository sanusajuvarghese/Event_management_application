import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthServiceService } from '../auth-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';

import { DOCUMENT } from '@angular/common';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  show = false;
  // submitted = false;
  // loading = false;

  constructor(private authService: AuthServiceService, public snackBar: MatSnackBar, @Inject(DOCUMENT) private document: Document) {}

  loginform = new FormGroup({
    usernameOrEmail: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-z]{2,4}$')]),
    password: new FormControl('', Validators.required),
  });

  ngOnInit(): void {
    this.show = true;
    setTimeout(() => {
      this.show = false;
    }, 1000);
  }

  get f() {
    return this.loginform.controls;
  }

  onSubmit(): void {
    this.show = true;

    // this.router.navigate(['events']);

    this.authService.getAuthourized(this.loginform.value).subscribe(
      (res) => {
        localStorage.removeItem('token');
        localStorage.setItem('token', res.body.accessToken);

        this.show = false;
        this.document.location.href = '/home';
        // this.router.navigate(['home']);
      },
      (error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.show = false;
          this.snackBar.open('Please enter valid credentials', 'Close', { duration: 3500, verticalPosition: 'top' });
        } else {
          this.show = false;
          this.snackBar.open('Oops, Something Went Wrong!!', 'Close', { duration: 3500, verticalPosition: 'top' });
        }
        this.show = false;
      }
    );
  }
}
