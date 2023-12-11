import { Component, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { appTitle } from 'src/app/app.config';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { AuthProvidersComponent } from '../auth-providers.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ImagCropperDialogComponent } from '../../shared/components/imag-cropper-dialog.component';
import { Subscription } from 'rxjs';
import { UtilityService } from 'src/app/core/services/utilities/utility.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FirestoreService } from 'src/app/core/services/firebase/firestore.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from 'src/app/core/services/firebase/auth.service';
import { User } from '@angular/fire/auth';
import { LetDirective } from '@ngrx/component';
import { serverTimestamp } from '@angular/fire/firestore';
import { School } from 'src/app/core/models/school.modei';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatDividerModule,
    MatButtonModule,
    RouterModule,
    MatStepperModule,
    AuthProvidersComponent,
    ImagCropperDialogComponent,
    MatCardModule,
    MatDialogModule,
    MatProgressBarModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    LetDirective,
    MatSnackBarModule,
    RouterModule,
  ],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>{{ appName }}</mat-card-title>
        <mat-card-subtitle
          >Enregistrez et gerez votre ecole en un clic ><br />
          Avez-vous deja une ecole ?
          <a mat-button color="primary" routerLink="/login">Connectez-vous</a>
        </mat-card-subtitle>
      </mat-card-header>
      <mat-divider></mat-divider>
      <mat-card-content class="mat-stepper-header">
        <mat-stepper linear #stepper>
          <mat-step label="Connectez-vous" [editable]="!isLogIn">
            <app-auth-providers></app-auth-providers>
          </mat-step>
          <mat-step label="Enregistrez votre ecole">
            <mat-progress-bar
              mode="indeterminate"
              *ngIf="isCroppedImgPending"
            ></mat-progress-bar>
            <form [formGroup]="schoolRegisterForm" class="school-register-form">
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
                  class="school-logo-img"
                  (click)="selectImg.click()"
                />
              </section>
              <mat-form-field appearance="outline" class="width-full">
                <mat-label>Nom de l'ecole</mat-label>
                <input
                  matInput
                  placeholder="Ex: Computer Business"
                  formControlName="name"
                  #input
                  maxlength="25"
                />
                <mat-hint align="end"
                  >{{ input.value.length || 0 }}/25</mat-hint
                >
                <mat-spinner
                  matSuffix
                  strokeWidth="2"
                  diameter="20"
                  *ngIf="schoolRegisterForm.controls.name.pending"
                ></mat-spinner>
                <mat-error
                  *ngIf="
                    schoolRegisterForm.controls.name.hasError('alreadyExist') &&
                    !schoolRegisterForm.controls.name.hasError('required')
                  "
                >
                  Cette ecole existe déjà.
                </mat-error>
                <mat-error
                  *ngIf="schoolRegisterForm.controls.name.hasError('required')"
                  >Entrez un nom de l'ecole</mat-error
                >
              </mat-form-field>

              <mat-form-field appearance="outline" class="width-full">
                <mat-label>Déscription de d'ecole</mat-label>
                <input
                  matInput
                  placeholder="Ex: Une école de qualité"
                  formControlName="description"
                />
              </mat-form-field>

              <div class="fied-in-row">
                <mat-form-field appearance="outline">
                  <mat-label>Email</mat-label>
                  <input
                    matInput
                    placeholder="Ex: example@gmail.com"
                    formControlName="email"
                    type="email"
                  />
                  <mat-error
                    *ngIf="schoolRegisterForm.controls.email.hasError('email')"
                    >Entrez une adresse mail</mat-error
                  >
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>N° Télephone</mat-label>
                  <input
                    matInput
                    placeholder="Ex: 24385401245"
                    formControlName="phone"
                  />
                  <mat-error
                    *ngIf="
                      schoolRegisterForm.controls.phone.hasError('pattern')
                    "
                    >Entrez que des chiffres</mat-error
                  >
                </mat-form-field>
              </div>

              <mat-divider></mat-divider>
              <div class="action" align="end" *ngrxLet="user$ as user">
                <button
                  mat-flat-button
                  color="primary"
                  (click)="onSubmit(user!)"
                  [disabled]="
                    isDisabledFormBtn ||
                    isCroppedImgPending ||
                    schoolRegisterForm.controls.name.pending ||
                    schoolRegisterForm.invalid
                  "
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </mat-step>
        </mat-stepper>
      </mat-card-content>
    </mat-card>
  `,
  styles: `
  @use '../../shared/styles/form-field.style' as * ;
   mat-card{
    width:max-content;
    margin:2rem auto;
  }
  mat-divider {
      margin:1rem 0 ;
  }
  .mat-stepper-header{
    pointer-events:none;
  }
  .school-register-form{
    pointer-events:initial;
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
  
  `,
})
export default class SignupComponent {
  appName = appTitle;
  croppedImage = '';
  private dialog = inject(MatDialog);
  private uts = inject(UtilityService);
  dialogSubs!: Subscription;
  isCroppedImgPending = false;
  private fs = inject(FirestoreService);
  isDisabledFormBtn = false;
  private authService = inject(AuthService);
  user$ = this.authService.currentUser;
  authState$ = this.authService.authState;
  authStateSubscription!: Subscription;
  snackBar = inject(MatSnackBar);
  @ViewChild('stepper') stepper!: MatStepper;
  isLogIn = false;
  router = inject(Router);

  ngOnInit(): void {
    this.authStateSubscription = this.authState$.subscribe(
      async (user: User | null) => {
        if (user) {
          if (await this.fs.schoolExists(user.uid)) {
            this.router.navigate(['/dashboard']);
          } else {
            this.isLogIn = true;
            this.stepper.next();
          }
        }
      }
    );
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
        this.isCroppedImgPending = true;
        this.croppedImage = await this.uts.croppedImage;
        this.isCroppedImgPending = false;
      });
    }
  }

  schoolRegisterForm = new FormGroup({
    name: new FormControl(
      '',
      [Validators.required],
      [this.fs.alreadyExistInputValidator(this.fs.schoolCollection, 'name')]
    ),
    description: new FormControl(''),
    email: new FormControl('', [Validators.email]),
    phone: new FormControl('', [Validators.pattern('^[0-9]*$')]),
  });

  onSubmit(user: User) {
    this.isDisabledFormBtn = true;

    const formValue = this.schoolRegisterForm.value;
    const { displayName, email, photoURL, uid } = user!;
    const school: School = {
      id: uid,
      name: formValue.name!,
      email: formValue.email!,
      description: formValue.description!,
      phone: formValue.phone!,
      logoUrlImg: this.croppedImage,
      owner: {
        displayName,
        email,
        photoURL,
        uid,
      },
      created: serverTimestamp(),
    };

    this.fs.newSchool(school);
    const notificationMsg = `${school.name} enregistrée avec succès !`;
    this.snackBar.open(notificationMsg, 'Ok', { duration: 1000 });
    this.router.navigate(['/dashboard']);
  }
}
