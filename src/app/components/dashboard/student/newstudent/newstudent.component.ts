import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatStepperModule } from '@angular/material/stepper';
import { MatDividerModule } from '@angular/material/divider';
import { UtilityService } from 'src/app/core/services/utilities/utility.service';
import { FirestoreService } from 'src/app/core/services/firebase/firestore.service';
import { StorageService } from 'src/app/core/services/firebase/storage.service';
import { Subscription } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { ImagCropperDialogComponent } from 'src/app/components/shared/components/imag-cropper-dialog.component';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Student } from 'src/app/core/models/student.model';
import { serverTimestamp } from '@angular/fire/firestore';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/core/services/firebase/auth.service';
import { LetDirective } from '@ngrx/component';
@Component({
  selector: 'app-newstudent',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatStepperModule,
    MatDividerModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    LetDirective,
  ],
  template: `
    <form [formGroup]="addStudentForm">
      <h1 mat-dialog-title>Ajouter un Elève</h1>
      <mat-divider></mat-divider>
      <div class="dilog-content" mat-dialog-content>
        <mat-stepper orientation="vertical" linear="" #stepper>
          <mat-step
            label="Uploader l'image de l'élève"
            [completed]="croppedImage"
          >
            <section class="school-logo">
              <input
                type="file"
                #selectImg
                hidden
                accept=".png , .jpg , .jpeg "
                (change)="fileChangeEvent($event)"
              />
              <img
                *ngIf="!croppedImage"
                src="../../../assets/image/logo-placeholder.jpg"
                alt="Logo place holder"
                class="school-logo-img"
                (click)="selectImg.click()"
              />
              <img
                *ngIf="croppedImage"
                [src]="croppedImage"
                alt="Logo place holder"
                class="student-picture"
                class="school-logo-img"
                (click)="selectImg.click()"
              />
            </section>
            <div class="actions" align="end">
              <button mat-flat-button matStepperNext color="primary">
                Suivant
              </button>
            </div>
          </mat-step>

          <mat-step
            [stepControl]="addStudentForm"
            label="Ajouter les Informations de l'élève"
          >
            <div class="fied-in-row margin-top">
              <mat-form-field appearance="outline">
                <mat-label>Nom</mat-label>
                <input matInput placeholder="Ex:David" formControlName="name" />
                <mat-error
                  *ngIf="addStudentForm.controls.name.hasError('required')"
                  >Entrez le nom s'il vous plait</mat-error
                >
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Post-nom</mat-label>
                <input
                  matInput
                  placeholder="Ex:Swedi"
                  formControlName="lastname"
                />
                <mat-error
                  *ngIf="addStudentForm.controls.lastname.hasError('required')"
                  >Entrez le Post-nom s'il vous plait</mat-error
                >
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Prenom</mat-label>
                <input
                  matInput
                  placeholder="Ex:Olivia"
                  formControlName="firstname"
                />
                <mat-error
                  *ngIf="addStudentForm.controls.firstname.hasError('required')"
                  >Entrez le prenom s'il vous plait</mat-error
                >
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Sexe</mat-label>
                <mat-select formControlName="gender">
                  <mat-option value="masculin">M</mat-option>
                  <mat-option value="feminin">F</mat-option>
                </mat-select>
                <mat-error
                  *ngIf="addStudentForm.controls.gender.hasError('required')"
                  >Choisissez le sexe</mat-error
                >
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Adresse</mat-label>
                <input
                  matInput
                  placeholder="Ibanda, Nyawera"
                  formControlName="address"
                />
                <mat-error
                  *ngIf="addStudentForm.controls.address.hasError('required')"
                  >Entrez une adresse</mat-error
                >
              </mat-form-field>
            </div>
          </mat-step>
        </mat-stepper>
      </div>
      <div class="actions" align="end" mat-dialog-actions>
        <button mat-stroked-button mat-dialog-close>Annuler</button>
        <button
          mat-flat-button
          mat-dialog-close
          color="primary"
          [disabled]="addStudentForm.invalid || disabledBtn"
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
   .school-logo-img {
        height: 5rem;
        width: 5rem;
        display: block;
        border-radius: 50%;
        background: lightgray;
        margin: auto;
        margin-bottom: 1rem;
        object-fit: cover;

        &:hover {
          cursor: pointer;
          background: lightgrey;
        }
      }
      .student-picture{
        width:100px;
        border-radius:15px;
      }

  `,
})
export class NewstudentComponent {
  private uts = inject(UtilityService);
  private fs = inject(FirestoreService);
  private ss = inject(StorageService);
  private snackbar = inject(MatSnackBar);
  readonly currentUser$ = inject(AuthService).currentUser;
  croppedImage = '';
  isCroppedImagePending = false;
  private dialog = inject(MatDialog);
  dialogSubs!: Subscription;
  disabledBtn = false;
  isOnline = this.uts.isOnline;

  fileChangeEvent(event: any): void {
    if (event.target.files) {
      let dialogRef = this.dialog.open(ImagCropperDialogComponent, {
        width: '30rem',
        disableClose: true,
        hasBackdrop: true,
        data: { event: event },
      });
      this.dialogSubs = dialogRef.afterClosed().subscribe(async () => {
        this.isCroppedImagePending = true;
        this.croppedImage = await this.uts.croppedImage;
        this.isCroppedImagePending = false;
      });
    }
  }

  addStudentForm = new FormBuilder().nonNullable.group({
    name: ['', Validators.required],
    lastname: ['', Validators.required],
    firstname: ['', Validators.required],
    gender: ['', Validators.required],
    address: ['', Validators.required],
  });

  onSubmit(userId: string) {
    this.disabledBtn = true;
    const formValue = this.addStudentForm.getRawValue();
    const student: Student = {
      id: this.fs.getDocId(this.fs.studentCollection(userId)),
      PhotoUrl: this.croppedImage,
      createdAt: serverTimestamp(),
      ...formValue,
    };

    this.fs.newStudent(student, userId);
    const notification = 'Eleve ajoute avec succes';
    this.snackbar.open(notification, '', { duration: 5000 });
  }
}
