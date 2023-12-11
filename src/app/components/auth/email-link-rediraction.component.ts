import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { appTitle } from 'src/app/app.config';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/core/services/firebase/auth.service';
import { FirestoreService } from 'src/app/core/services/firebase/firestore.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { User } from '@angular/fire/auth';

@Component({
  selector: 'app-email-link-rediraction',
  standalone: true,
  imports: [CommonModule, MatSnackBarModule],
  template: ` <div class="email-link-container">
    <h1>{{ appName }}</h1>
    <p *ngIf="!showMessageState">
      Le lien d'authentification vous a été envoyé à l'adresse
      <b>"{{ email }}"</b>, Cliquez sur le lien envoyé pour être authentifié
    </p>
    <p *ngIf="showMessageState">
      Veillez pantienter pendant que nous authentifions
      <b>"{{ email }}"</b>...
    </p>
  </div>`,
  styles: `
   .email-link-container {
        width: clamp(60%, 5vw, 80%);
        margin: 2rem auto;
        text-align: center;
      }
  `,
})
export default class EmailLinkRediractionComponent {
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
            this.router.navigate(['/dashbaord']);
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
