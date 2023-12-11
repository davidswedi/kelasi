import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from 'src/app/core/services/firebase/auth.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-auth-providers',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    RouterModule,
  ],
  template: `
    <button
      class="google-auth-btn"
      mat-fab
      extended
      color="primary"
      (click)="loginWithGoogle()"
    >
      <mat-icon>login</mat-icon>
      Connectez-vous avec google
    </button>

    <div class="divider">
      <mat-divider></mat-divider>
      <span>ou</span>
      <mat-divider></mat-divider>
    </div>

    <form [formGroup]="emailForm" align="end">
      <mat-form-field appearance="outline" class="email-field">
        <mat-label>Email</mat-label>
        <input
          matInput
          type="email"
          placeholder="Ex:elite@gmail.com"
          formControlName="email"
        />
        <mat-error *ngIf="emailForm.controls.email.hasError('required')"
          >Entrez une adresse mail</mat-error
        >
        <mat-error
          *ngIf="
            !emailForm.controls.email.hasError('required') &&
            emailForm.controls.email.hasError('email')
          "
          >Email erone</mat-error
        >
      </mat-form-field>
      <button
        class="emai-auth-button"
        mat-stroked-button
        color="primary"
        [disabled]="emailForm.invalid"
        (click)="onEmailLinkFormSubmit()"
      >
        Connexion
      </button>
    </form>
  `,
  styles: `
    *{
      pointer-events:initial;
    }
   .google-auth-btn {
        width: 100%;
        box-shadow: none;
      }

      
      form {
        border: 1px solid gray;
        border-radius: 8px;
        padding: 1rem;
      }

      mat-form-field {
        width: 100%;
      }

   .divider {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 1rem 0;

        mat-divider {
          width: 40%;
        }
      }
  
  `,
})
export class AuthProvidersComponent {
  private authService = inject(AuthService);
  router = inject(Router);

  emailForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  emailLinkForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  loginWithGoogle = () => this.authService.loginWithGoogle();

  onEmailLinkFormSubmit() {
    const email = this.emailLinkForm.value.email!;

    const actionCodeSettings = {
      url: `${location.origin}/email-link-rediraction`,
      handleCodeInApp: true,
    };

    this.authService.sendAuthLink(email, actionCodeSettings);
    localStorage.setItem('emailForSignIn', email);
    this.router.navigate(['email-link-redirection']);
  }
}
