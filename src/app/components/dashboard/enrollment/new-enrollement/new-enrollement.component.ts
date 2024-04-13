import { Student } from './../../../../core/models/student.model';
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { FirestoreService } from 'src/app/core/services/firebase/firestore.service';
import { AuthService } from 'src/app/core/services/firebase/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Enrollement } from 'src/app/core/models/enrollement.model';
import { Subscription } from 'rxjs';
import { Class } from 'src/app/core/models/class.model';
import { serverTimestamp } from '@angular/fire/firestore';
import { LetDirective } from '@ngrx/component';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-new-enrollement',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    MatDialogModule,
    LetDirective,
    MatButtonModule,
  ],
  template: `
    <form [formGroup]="addEnrollementForm">
      <h1 mat-dialog-title>
        {{ enroll ? 'Modifier l"inscription' : 'Ajouter une inscription' }}
      </h1>
      <div class="dilog-content" mat-dialog-content>
        <div class="fied-in-row margin-top">
          <mat-form-field appearance="outline">
            <mat-label>Elève</mat-label>
            <mat-select formControlName="studentId">
              @for (student of Students; track student.id) {
              <mat-option [value]="student.name"
                >{{ student.name }} -- {{ student.lastname }}</mat-option
              >
              }
            </mat-select>
            <mat-error
              *ngIf="addEnrollementForm.controls.studentId.hasError('required')"
              >Veuillez choisir un élève
            </mat-error>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Classe</mat-label>
            <mat-select formControlName="classId">
              @for (room of Classes; track room.id) {
              <mat-option [value]="room.designation">{{
                room.designation
              }}</mat-option>
              }
            </mat-select>
            <mat-error
              *ngIf="addEnrollementForm.controls.classId.hasError('required')"
              >Veuillez choisir la la classe
            </mat-error>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Dossier</mat-label>
            <input matInput placeholder="Ex:5" formControlName="documents" />
            <mat-error
              *ngIf="addEnrollementForm.controls.documents.hasError('required')"
              >Veuillez entrer le nombre des documents
            </mat-error>
          </mat-form-field>
        </div>
      </div>
      <div class="actions" align="end" mat-dialog-actions>
        <button mat-stroked-button mat-dialog-close>Annuler</button>
        <button
          mat-flat-button
          mat-dialog-close
          color="primary"
          [disabled]="addEnrollementForm.invalid || disabledBtn"
          *ngrxLet="currentUser$ | async as user"
          (click)="onSubmit(user?.uid!)"
        >
          Enregistrer
        </button>
      </div>
    </form>
  `,
  styles: `
   @use '../../../shared/styles/form-field.style' as * ;

    .margin-top{
      margin-top:0.9rem;
    }

  
  `,
})
export class NewEnrollementComponent {
  private fs = inject(FirestoreService);
  private auth = inject(AuthService);
  snackbar = inject(MatSnackBar);
  readonly enroll: Enrollement = inject(MAT_DIALOG_DATA);
  currentUser$ = this.auth.currentUser;
  enrollCollection!: string;
  disabledBtn = false;
  yearId!: string;
  userSubscription!: Subscription;
  subscription!: Subscription;
  studentCollection!: string;
  classCollection!: string;

  Students: Student[] = [];
  Classes: Class[] = [];

  ngOnInit() {
    const yearId = localStorage.getItem('yearId')!;
    this.yearId = yearId;
    if (this.enroll) {
      this.addEnrollementForm.patchValue(this.enroll);
    }
    this.userSubscription = this.auth.currentUser.subscribe((user) => {
      this.studentCollection = this.fs.studentCollection(
        this.yearId,
        user?.uid!
      );
      this.subscription = this.fs
        .getCollectionData(this.studentCollection)
        .subscribe((docData) => {
          const students = docData as Student[];
          this.Students = students;
        });
    });

    this.userSubscription = this.auth.currentUser.subscribe((user) => {
      this.classCollection = this.fs.classCollection(this.yearId, user?.uid!);
      this.subscription = this.fs
        .getCollectionData(this.classCollection)
        .subscribe((docData) => {
          const classes = docData as Class[];
          this.Classes = classes;
          console.log(this.Classes);
        });
    });
  }
  addEnrollementForm = new FormBuilder().nonNullable.group({
    studentId: ['', Validators.required],
    classId: ['', Validators.required],
    documents: ['', Validators.required],
  });

  onSubmit(userId: string) {
    const formvalue = this.addEnrollementForm.getRawValue();

    const Enroll: Enrollement = {
      id: this.fs.getDocId(this.fs.enrollementCollection(this.yearId, userId)),
      createdAt: serverTimestamp(),
      ...formvalue,
    };
    this.fs.newEnrollement(Enroll, this.yearId, userId);

    let notification = this.enroll
      ? 'Modification réussie!'
      : 'Inscription ajoutée avec succès!';
    this.snackbar.open(notification, '', { duration: 5000 });
  }
}
