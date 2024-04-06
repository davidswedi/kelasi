import { MatSelectModule } from '@angular/material/select';
import { appTitle } from 'src/app/app.config';
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { Timestamp } from '@angular/fire/firestore';
import { AuthService } from 'src/app/core/services/firebase/auth.service';
import { Subscription } from 'rxjs';
import { FirestoreService } from 'src/app/core/services/firebase/firestore.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-choose-year',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatOptionModule,
    MatDividerModule,
    MatButtonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatSelectModule,
  ],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>{{ appName }}</mat-card-title>
        <mat-card-subtitle>Choisissez l'annéé d'exercisse? </mat-card-subtitle>
      </mat-card-header>
      <mat-divider></mat-divider>
      <mat-card-content>
        <form [formGroup]="yearForm" align="end">
          <mat-form-field appearance="outline" class="email-field">
            <mat-label>Année Scolaire</mat-label>
            <mat-select required formControlName="year">
              @for (year of years; track year.annee) {
              <mat-option [value]="year.id">{{ year.annee }}</mat-option>
              }
            </mat-select>
          </mat-form-field>
          <button
            class="emai-auth-button"
            mat-stroked-button
            color="primary"
            (click)="onSubmit()"
          >
            Poursuivre
          </button>
        </form>
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
   form {
        border: 1px solid gray;
        border-radius: 8px;
        padding: 1rem;
      }

      mat-form-field {
        width: 100%;
      }
  `,
})
export default class ChooseYearComponent {
  appName = appTitle;
  private fs = inject(FirestoreService);
  private auth = inject(AuthService);
  userSubscription!: Subscription;
  subscription!: Subscription;
  academicYearCollection!: string;
  router = inject(Router);
  years: Year[] = [];

  ngOnInit() {
    this.userSubscription = this.auth.currentUser.subscribe((user) => {
      this.academicYearCollection = this.fs.academicYearCollection(user?.uid!);
      this.subscription = this.fs
        .getCollectionData(this.academicYearCollection)
        .subscribe((docData) => {
          const years = docData as Year[];
          this.years = years;
        });
    });
  }

  yearForm = new FormGroup({
    year: new FormControl('', Validators.required),
  });
  onSubmit() {
    const yearId = this.yearForm.value.year!;
    localStorage.setItem('yearId', yearId);
    this.router.navigate(['/dashboard']);
  }
}
export interface Year {
  id: string;
  annee: number;
  createdAt: Timestamp;
}
