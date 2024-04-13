import { Component, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderTableActionComponent } from '../../shared/components/header-table-action.component';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { NewEnrollementComponent } from './new-enrollement/new-enrollement.component';
import { MatTableDataSource } from '@angular/material/table';
import { Enrollement } from 'src/app/core/models/enrollement.model';
import { Firestore } from '@angular/fire/firestore';
import { AuthService } from 'src/app/core/services/firebase/auth.service';
import { Subscription } from 'rxjs';
import { FirestoreService } from 'src/app/core/services/firebase/firestore.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-enrollment',
  standalone: true,
  imports: [
    CommonModule,
    HeaderTableActionComponent,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    MatPaginatorModule,
  ],
  template: `
    <app-header-table-action
      btnLabel="Nouvelle Inscription"
      searchPlaceholder="Cherchez classe , élève par nom"
      [dialogComponent]="newEnroll"
      [collectionName]="enrollementCollection"
      [tableDataSource]="dataSource"
    />
    <div class="mat-elevation-z1">
      <table mat-table [dataSource]="dataSource" matSort multiTemplateDataRows>
        <!-- id Column -->
        <ng-container matColumnDef="id">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>No.</th>
          <td mat-cell *matCellDef="let enroll">
            {{ dataSource.filteredData.indexOf(enroll) + 1 }}
          </td>
        </ng-container>

        <!-- Name Column -->
        <ng-container matColumnDef="studentId">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Elève</th>
          <td mat-cell *matCellDef="let enroll">{{ enroll.studentId }}</td>
        </ng-container>

        <!-- lastname Column -->
        <ng-container matColumnDef="classId">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Classe</th>
          <td mat-cell *matCellDef="let enroll">{{ enroll.classId }}</td>
        </ng-container>
        <ng-container matColumnDef="documents">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>
            Nombre des documents
          </th>
          <td mat-cell *matCellDef="let enroll">{{ enroll.documents }}</td>
        </ng-container>

        <ng-container matColumnDef="action">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Action</th>
          <td mat-cell *matCellDef="let enroll">
            <button
              mat-icon-button
              matTooltip="Modifier"
              (click)="updateEnroll(enroll)"
            >
              <mat-icon color="primary">mode_edit</mat-icon>
            </button>
            <button
              mat-icon-button
              matTooltip="Supprimer"
              (click)="deleteEnroll(enroll.id)"
            >
              <mat-icon>delete</mat-icon>
            </button>
          </td>
        </ng-container>
        <!-- <ng-container matColumnDef="expandDetail">
          <td
            mat-cell
            *matCellDef="let student"
            [attr.colspan]="displayedColumns.length"
          ></td>
        </ng-container> -->
        <tr mat-row *matRowDef="let section; columns: displayedColumns"></tr>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <!-- <tr
          mat-row
          *matRowDef="let student; columns: ['expandDetail']"
          class="detail-row"
        ></tr> -->

        <tr class="mat-row" *matNoDataRow>
          <td class="mat-cell mat-no-data-row" colspan="8" align="center">
            Pas des données correpondantes
          </td>
        </tr>
      </table>

      <mat-paginator
        [pageSizeOptions]="[5, 10, 20]"
        showFirstLastButtons
        aria-label="Select page of periodic elements"
      >
      </mat-paginator>
    </div>
  `,
  styles: `

  `,
})
export default class EnrollmentComponent {
  newEnroll = NewEnrollementComponent;
  displayedColumns: string[] = [
    'id',
    'studentId',
    'classId',
    'documents',
    'action',
  ];
  dataSource = new MatTableDataSource<Enrollement>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  private fs = inject(FirestoreService);
  auth = inject(AuthService);
  snackbar = inject(MatSnackBar);
  dialog = inject(MatDialog);
  userSubScription!: Subscription;
  subscription!: Subscription;
  enrollementCollection!: string;
  yearId!: string;

  ngOnInit() {
    const yearId = localStorage.getItem('yearId')!;
    this.yearId = yearId;

    this.userSubScription = this.auth.currentUser.subscribe((user) => {
      this.enrollementCollection = this.fs.enrollementCollection(
        this.yearId,
        user?.uid!
      );
      this.subscription = this.fs
        .getCollectionData(this.enrollementCollection)
        .subscribe((docData) => {
          const enrolls = docData as Enrollement[];
          this.dataSource.data = enrolls;
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        });
    });
  }

  updateEnroll(enroll: Enrollement) {
    this.dialog.open(this.newEnroll, {
      hasBackdrop: true,
      disableClose: true,
      data: enroll,
    });
  }
  deleteEnroll(docId: string) {
    this.userSubScription = this.auth.currentUser.subscribe((user) => {
      const enrollementCollection: string = this.fs.enrollementCollection(
        this.yearId,
        user?.uid!
      );
      this.fs.deleteDocData(enrollementCollection, docId);
      const notification = 'Inscription effacée avec succès';
      this.snackbar.open(notification, '', { duration: 5000 });
    });
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.userSubScription.unsubscribe();
  }
}
