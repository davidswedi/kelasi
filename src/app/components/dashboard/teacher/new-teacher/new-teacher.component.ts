import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { serverTimestamp } from '@angular/fire/firestore';
import { FormBuilder, Validators } from '@angular/forms';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { ImagCropperDialogComponent } from 'src/app/components/shared/components/imag-cropper-dialog.component';
import { Teacher } from 'src/app/core/models/teacher.model';
import { AuthService } from 'src/app/core/services/firebase/auth.service';
import { FirestoreService } from 'src/app/core/services/firebase/firestore.service';
import { StorageService } from 'src/app/core/services/firebase/storage.service';
import { UtilityService } from 'src/app/core/services/utilities/utility.service';
import { ReactiveFormsModule } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { LetDirective } from '@ngrx/component';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-new-teacher',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatDividerModule,
    MatFormFieldModule,
    MatSelectModule,
    LetDirective,
    MatDialogModule,
    MatInputModule,
  ],
  template: `
    <form [formGroup]="addTeacherForm">
      <h1 mat-dialog-title>
        {{ teacher ? 'Modifier les infos de élève' : 'Ajouter un élève' }}
      </h1>
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
                *ngIf="!croppedImage && !teacher"
                src="../../../assets/image/logo-placeholder.jpg"
                alt="Logo place holder"
                class="school-logo-img"
                (click)="selectImg.click()"
              />
              <img
                *ngIf="croppedImage || teacher"
                [src]="teacher ? teacher.PhotoUrl : croppedImage"
                alt="Logo place holder"
                class="teacher-picture"
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
            [stepControl]="addTeacherForm"
            label="Ajouter les Informations de l'élève"
          >
            <div class="fied-in-row margin-top">
              <mat-form-field appearance="outline">
                <mat-label>Nom</mat-label>
                <input matInput placeholder="Ex:David" formControlName="name" />
                <mat-error
                  *ngIf="addTeacherForm.controls.name.hasError('required')"
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
                  *ngIf="addTeacherForm.controls.lastname.hasError('required')"
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
                  *ngIf="addTeacherForm.controls.firstname.hasError('required')"
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
                  *ngIf="addTeacherForm.controls.gender.hasError('required')"
                  >Choisissez le sexe</mat-error
                >
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Grade</mat-label>
                <mat-select formControlName="grade">
                  <mat-option value="licence">Licence</mat-option>
                  <mat-option value="grade">Grade</mat-option>
                </mat-select>
                <mat-error
                  *ngIf="addTeacherForm.controls.grade.hasError('required')"
                  >Choisissez un grade</mat-error
                >
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Adresse</mat-label>
                <input
                  matInput
                  placeholder="Ex:Nyawera"
                  formControlName="adress"
                />
                <mat-error
                  *ngIf="addTeacherForm.controls.adress.hasError('required')"
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
          [disabled]="addTeacherForm.invalid || disabledBtn"
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
      .teacher-picture{
        width:100px;
        border-radius:15px;
      }

  `,
})
export class NewTeacherComponent {
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
  readonly teacher: Teacher = inject(MAT_DIALOG_DATA);
  isOnline = this.uts.isOnline;
  yearId!: string;
  ngOnInit(): void {
    const yearId = localStorage.getItem('yearId')!;
    this.yearId = yearId;

    if (this.teacher) {
      this.addTeacherForm.patchValue(this.teacher);
    }
  }

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

  addTeacherForm = new FormBuilder().nonNullable.group({
    name: ['', Validators.required],
    lastname: ['', Validators.required],
    firstname: ['', Validators.required],
    gender: ['', Validators.required],
    grade: ['', Validators.required],
    adress: ['', Validators.required],
  });

  onSubmit(userId: string) {
    this.disabledBtn = true;
    const formValue = this.addTeacherForm.getRawValue();
    const teacher: Teacher = {
      id: this.fs.getDocId(this.fs.teacherCollection(this.yearId, userId)),
      PhotoUrl: this.croppedImage,
      createdAt: serverTimestamp(),
      ...formValue,
    };

    this.fs.newTeacher(teacher, this.yearId, userId);

    let notification = this.teacher
      ? 'Modification réussie!'
      : 'Enseignant ajouté avec succès!';
    this.snackbar.open(notification, '', { duration: 5000 });
  }
}
