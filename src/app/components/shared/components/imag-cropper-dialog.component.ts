import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { ImageCroppedEvent, ImageCropperModule } from 'ngx-image-cropper';
import { MatDividerModule } from '@angular/material/divider';
import { UtilityService } from 'src/app/core/services/utilities/utility.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { StorageService } from 'src/app/core/services/firebase/storage.service';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-imag-cropper-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    ImageCropperModule,
    MatDividerModule,
    MatSnackBarModule,
    MatButtonModule,
  ],
  template: `
    <h2 mat-dialog-title>Rognez l'image</h2>
    <image-cropper
      mat-dialog-content
      [imageChangedEvent]="data.event"
      [maintainAspectRatio]="true"
      [aspectRatio]="1 / 1"
      (imageCropped)="imageCropped($event)"
      (loadImageFailed)="loadImageFailed()"
      format="png"
    ></image-cropper>
    <mat-divider></mat-divider>
    <div mat-dialog-actions align="end">
      <button mat-flat-button color="primary" mat-dialog-close>Cropper</button>
    </div>
  `,
  styles: `
  
  image-cropper {
        height: fit-content;
        max-height: 50vh;
        margin: auto;
      }
  `,
})
export class ImagCropperDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { event: any },
    private uts: UtilityService,
    private _snackBar: MatSnackBar,
    private ss: StorageService
  ) {}

  imageCropped(event: ImageCroppedEvent) {
    this.uts.croppedImage = this.ss.uploadImgToStorage(event.blob!);
  }

  loadImageFailed() {
    this._snackBar.open("Une erreur s'est produite");
  }
}
