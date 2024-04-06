import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { Router, RouterModule } from '@angular/router';
import { MatDividerModule } from '@angular/material/divider';
import { AuthProvidersComponent } from '../auth-providers.component';
import { MatButtonModule } from '@angular/material/button';
import { appTitle } from 'src/app/app.config';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/core/services/firebase/auth.service';
import { FirestoreService } from 'src/app/core/services/firebase/firestore.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { User } from '@angular/fire/auth';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    RouterModule,
    MatDividerModule,
    AuthProvidersComponent,
    MatButtonModule,
    MatSnackBarModule,
  ],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>{{ appName }}</mat-card-title>
        <mat-card-subtitle
          >Connectez-vous et gerez votre ecole en un clic ><br />
          besoin d'une ecole ?
          <a mat-button color="primary" routerLink="/signup">Creez un compte</a>
        </mat-card-subtitle>
      </mat-card-header>
      <mat-divider></mat-divider>
      <mat-card-content>
        <app-auth-providers></app-auth-providers>
      </mat-card-content>
    </mat-card>
  `,
  styles: `
  
  mat-card{
    width:max-content;
    margin:2rem auto;
  }
  mat-divider { 
      margin:1rem 0 ;
  }
  
  
  `,
})
export default class LoginComponent {
  appName = appTitle;
  showMessageState!: boolean;
  private router = inject(Router);
  email = localStorage.getItem('emailForSignIn');
  authStateSubscription?: Subscription;
  private authService = inject(AuthService);
  private fs = inject(FirestoreService);
  private snackBar = inject(MatSnackBar);
  authState$ = this.authService.authState;
  ngOnInit() {
    this.showMessageState = this.router.url.includes('apikey');
    this.authService.loginWithEmailLink();
    this.authStateSubscription = this.authState$.subscribe(
      async (user: User | null) => {
        if (user) {
          if (await this.fs.schoolExists(user.uid)) {
            this.router.navigate(['/choose-year']);
          } else {
            this.router.navigate(['/signup']);
            this.snackBar.open(
              'Aucune ecole identifie a ce compte ,creer une ecole',
              'Ok'
            );
          }
        }
      }
    );
  }

  ngOnDestroy() {
    this.authStateSubscription?.unsubscribe();
  }
}
