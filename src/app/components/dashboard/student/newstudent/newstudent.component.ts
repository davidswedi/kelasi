import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatStepperModule } from '@angular/material/stepper';
import { MatDividerModule } from '@angular/material/divider';
import { UtilityService } from 'src/app/core/services/utilities/utility.service';
import { FirestoreService } from 'src/app/core/services/firebase/firestore.service';
import { StorageService } from 'src/app/core/services/firebase/storage.service';
import { Subscription } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { ImagCropperDialogComponent } from 'src/app/components/shared/components/imag-cropper-dialog.component';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
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
  ],
  template: `
    <form [formGroup]="addStudentForm">
      <h1 mat-dialog-title>Ajouter un Elève</h1>
      <mat-divider></mat-divider>
      <div class="mat-content" mat-dialog-content>
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
          ></mat-step>
        </mat-stepper>
      </div>
    </form>
  `,
  styles: `
   @use '../../../shared/styles/form-field.style' as * ;
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
  croppedImage = '';
  isCroppedImagePending = false;
  private dialog = inject(MatDialog);
  dialogSubs!: Subscription;

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

  addStudentForm = new FormGroup({});
}
