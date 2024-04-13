import { Class } from './../../../core/models/class.model';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Component, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { HeaderTableActionComponent } from '../../shared/components/header-table-action.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NewClassComponent } from './new-class/new-class.component';
import { MatSort } from '@angular/material/sort';
import { Subscription } from 'rxjs';
import { FirestoreService } from 'src/app/core/services/firebase/firestore.service';
import { AuthService } from 'src/app/core/services/firebase/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-classes',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    HeaderTableActionComponent,
    MatIconModule,
    MatButtonModule,
  ],
  template: `
    <app-header-table-action
      btnLabel="Nouvelle Classe"
      searchPlaceholder="Cherchez la classe par nom"
      [dialogComponent]="newClass"
      [collectionName]="classCollection"
      [tableDataSource]="dataSource"
    />
    <div class="mat-elevation-z1">
      <table mat-table [dataSource]="dataSource" matSort multiTemplateDataRows>
        <!-- id Column -->
        <ng-container matColumnDef="id">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>No.</th>
          <td mat-cell *matCellDef="let class">
            {{ dataSource.filteredData.indexOf(class) + 1 }}
          </td>
        </ng-container>

        <!-- Name Column -->
        <ng-container matColumnDef="designation">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Designation</th>
          <td mat-cell *matCellDef="let class">{{ class.designation }}</td>
        </ng-container>
        <ng-container matColumnDef="sectionId">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Section</th>
          <td mat-cell *matCellDef="let class">{{ class.sectionId }}</td>
        </ng-container>

        <ng-container matColumnDef="action">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Action</th>
          <td mat-cell *matCellDef="let class">
            <button
              mat-icon-button
              matTooltip="Modifier"
              (click)="updateClass(class)"
            >
              <mat-icon color="primary">mode_edit</mat-icon>
            </button>
            <button
              mat-icon-button
              matTooltip="Supprimer"
              (click)="deleteClass(class.id)"
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
  styles: ``,
})
export default class ClassesComponent {
  snackbar = inject(MatSnackBar);
  dialog = inject(MatDialog);
  classCollection!: string;
  newClass = NewClassComponent;
  displayedColumns: string[] = ['id', 'designation', 'sectionId', 'action'];
  dataSource = new MatTableDataSource<Class>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  yearId!: string;
  subscription!: Subscription;
  userSubScription!: Subscription;
  private fs = inject(FirestoreService);
  auth = inject(AuthService);
  ngOnInit() {
    const yearId = localStorage.getItem('yearId')!;
    this.yearId = yearId;

    this.userSubScription = this.auth.currentUser.subscribe((user) => {
      this.classCollection = this.fs.classCollection(this.yearId, user?.uid!);
      this.subscription = this.fs
        .getCollectionData(this.classCollection)
        .subscribe((docData) => {
          const classes = docData as Class[];
          this.dataSource.data = classes;
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        });
    });
  }

  updateClass(Class: Class) {
    this.dialog.open(this.newClass, {
      hasBackdrop: true,
      disableClose: true,
      data: Class,
    });
  }
  deleteClass(docId: string) {
    this.userSubScription = this.auth.currentUser.subscribe((user) => {
      const classCollection: string = this.fs.classCollection(
        this.yearId,
        user?.uid!
      );
      this.fs.deleteDocData(classCollection, docId);
      const notification = 'Classe effacée avec succès';
      this.snackbar.open(notification, '', { duration: 5000 });
    });
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.userSubScription.unsubscribe();
  }
}
