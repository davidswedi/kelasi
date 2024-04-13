import { Class } from './../../../../core/models/class.model';
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { FirestoreService } from 'src/app/core/services/firebase/firestore.service';
import { AuthService } from 'src/app/core/services/firebase/auth.service';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { serverTimestamp } from '@angular/fire/firestore';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { Section } from 'src/app/core/models/section.model';
import { MatButtonModule } from '@angular/material/button';
import { LetDirective } from '@ngrx/component';
import { MatInputModule } from '@angular/material/input';
@Component({
  selector: 'app-new-class',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonModule,
    MatInputModule,
    LetDirective,
    MatDialogModule,
  ],
  template: `
    <form [formGroup]="addClassForm">
      <h1 mat-dialog-title>
        {{ class ? 'Modifier la classe' : 'Ajouter une classe' }}
      </h1>
      <div class="dilog-content" mat-dialog-content>
        <div class="fied-in-row margin-top">
          <mat-form-field appearance="outline">
            <mat-label>Designation</mat-label>
            <input matInput placeholder="Ex:7A" formControlName="designation" />
            <mat-error
              *ngIf="addClassForm.controls.designation.hasError('required')"
              >Veuillez entrer le nom de la classe
            </mat-error>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label><Section></Section></mat-label>
            <mat-select formControlName="sectionId">
              @for (section of sections; track section.id) {
              <mat-option [value]="section.designation">{{
                section.designation
              }}</mat-option>
              }
            </mat-select>
            <mat-error
              *ngIf="addClassForm.controls.sectionId.hasError('required')"
              >Veuillez choisir la section
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
          [disabled]="addClassForm.invalid || disabledBtn"
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
export class NewClassComponent {
  private fs = inject(FirestoreService);
  private auth = inject(AuthService);
  snackbar = inject(MatSnackBar);
  readonly class: Class = inject(MAT_DIALOG_DATA);
  currentUser$ = this.auth.currentUser;
  classCollection!: string;
  disabledBtn = false;
  yearId!: string;
  userSubscription!: Subscription;
  subscription!: Subscription;
  sectionCollection!: string;
  sections: Section[] = [];
  ngOnInit() {
    const yearId = localStorage.getItem('yearId')!;
    this.yearId = yearId;
    if (this.class) {
      this.addClassForm.patchValue(this.class);
    }

    this.userSubscription = this.auth.currentUser.subscribe((user) => {
      this.sectionCollection = this.fs.sectionCollection(
        this.yearId,
        user?.uid!
      );
      this.subscription = this.fs
        .getCollectionData(this.sectionCollection)
        .subscribe((docData) => {
          const sections = docData as Section[];
          this.sections = sections;
        });
    });
  }

  addClassForm = new FormBuilder().nonNullable.group({
    designation: ['', Validators.required],
    sectionId: ['', Validators.required],
  });

  onSubmit(userId: string) {
    const formValue = this.addClassForm.getRawValue();

    const Class: Class = {
      id: this.fs.getDocId(this.fs.classCollection(this.yearId, userId)),
      createdAt: serverTimestamp(),
      ...formValue,
    };
    this.fs.newClass(Class, this.yearId, userId);
    let notification = this.class
      ? 'Modification réussie!'
      : 'Classe  ajoutée avec succès!';
    this.snackbar.open(notification, '', { duration: 5000 });
  }
}
