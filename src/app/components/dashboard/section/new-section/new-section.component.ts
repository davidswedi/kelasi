import { Student } from './../../../../core/models/student.model';
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
} from '@angular/material/dialog';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UtilityService } from 'src/app/core/services/utilities/utility.service';
import { FirestoreService } from 'src/app/core/services/firebase/firestore.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/core/services/firebase/auth.service';
import { Section } from 'src/app/core/models/section.model';
import { serverTimestamp } from '@angular/fire/firestore';
import { LetDirective } from '@ngrx/component';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
@Component({
  selector: 'app-new-section',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSelectModule,
    LetDirective,
    MatButtonModule,
    MatOptionModule,
    MatSelectModule,
  ],
  template: `
    <form [formGroup]="addSectionForm">
      <h1 mat-dialog-title>
        {{ section ? 'Modifier la section' : 'Ajouter une section' }}
      </h1>
      <div class="dilog-content" mat-dialog-content>
        <div class="fied-in-row margin-top">
          <mat-form-field appearance="outline">
            <mat-label>Designation</mat-label>
            <input
              matInput
              placeholder="Ex:Pédagogie"
              formControlName="designation"
            />
            <mat-error
              *ngIf="addSectionForm.controls.designation.hasError('required')"
              >Veuillez entrer le nom de la section
            </mat-error>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Post-nom</mat-label>
            <mat-select formControlName="cycle">
              <mat-option value="long"> Long </mat-option>
              <mat-option value="court"> Court </mat-option>
            </mat-select>
            <mat-error
              *ngIf="addSectionForm.controls.cycle.hasError('required')"
              >Veuillez préciser le cycle</mat-error
            >
          </mat-form-field>
        </div>
      </div>
      <div class="actions" align="end" mat-dialog-actions>
        <button mat-stroked-button mat-dialog-close>Annuler</button>
        <button
          mat-flat-button
          mat-dialog-close
          color="primary"
          [disabled]="addSectionForm.invalid || disabledBtn"
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
export class NewSectionComponent {
  private uts = inject(UtilityService);
  private fs = inject(FirestoreService);
  private snackbar = inject(MatSnackBar);
  readonly currentUser$ = inject(AuthService).currentUser;
  readonly section: Section = inject(MAT_DIALOG_DATA);
  sectionCollection!: string;
  disabledBtn = false;
  yearId!: string;

  ngOnInit() {
    const yearId = localStorage.getItem('yearId')!;
    this.yearId = yearId;

    if (this.section) {
      this.addSectionForm.patchValue(this.section);
    }
  }

  addSectionForm = new FormBuilder().nonNullable.group({
    designation: ['', Validators.required],
    cycle: ['', Validators.required],
  });

  onSubmit(userId: string) {
    this.disabledBtn = true;
    const formValue = this.addSectionForm.getRawValue();
    const section: Section = {
      id: this.fs.getDocId(this.fs.sectionCollection(this.yearId, userId)),
      createdAt: serverTimestamp(),
      ...formValue,
    };
    this.fs.newSection(section, this.yearId, userId);
    let notification = this.section
      ? 'Modification réussie!'
      : 'Section  ajoutée avec succès!';
    this.snackbar.open(notification, '', { duration: 5000 });
  }
}
