import { Component, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderTableActionComponent } from '../../shared/components/header-table-action.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatPaginator } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FirestoreService } from 'src/app/core/services/firebase/firestore.service';
import { StorageService } from 'src/app/core/services/firebase/storage.service';
import { UtilityService } from 'src/app/core/services/utilities/utility.service';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/core/services/firebase/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { NewTeacherComponent } from './new-teacher/new-teacher.component';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Teacher } from 'src/app/core/models/teacher.model';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-teacher',
  standalone: true,
  imports: [
    MatTableModule,
    CommonModule,
    HeaderTableActionComponent,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
  ],
  template: `
    <app-header-table-action
      btnLabel="Nouvel Enseignant"
      searchPlaceholder="Cherchez par Nom"
      [dialogComponent]="newTeacher"
      [collectionName]="teacherCollection"
      [tableDataSource]="dataSource"
    />
    <div class="mat-elevation-z1">
      <table mat-table [dataSource]="dataSource" matSort multiTemplateDataRows>
        <!-- id Column -->
        <ng-container matColumnDef="id">
          <th mat-header-cell *matHeaderCellDef>No.</th>
          <td mat-cell *matCellDef="let teacher">
            {{ dataSource.filteredData.indexOf(teacher) + 1 }}
          </td>
        </ng-container>

        <!-- Name Column -->
        <ng-container matColumnDef="name">
          <th mat-header-cell *matHeaderCellDef>Name</th>
          <td mat-cell *matCellDef="let teacher">{{ teacher.name }}</td>
        </ng-container>

        <!-- lastname Column -->
        <ng-container matColumnDef="lastname">
          <th mat-header-cell *matHeaderCellDef>Lastname</th>
          <td mat-cell *matCellDef="let teacher">{{ teacher.lastname }}</td>
        </ng-container>
        <ng-container matColumnDef="firstname">
          <th mat-header-cell *matHeaderCellDef>Lastname</th>
          <td mat-cell *matCellDef="let teacher">{{ teacher.firstname }}</td>
        </ng-container>

        <!-- gender Column -->
        <ng-container matColumnDef="gender">
          <th mat-header-cell *matHeaderCellDef>Gender</th>
          <td mat-cell *matCellDef="let teacher">{{ teacher.gender }}</td>
        </ng-container>
        <ng-container matColumnDef="grade">
          <th mat-header-cell *matHeaderCellDef>Grade</th>
          <td mat-cell *matCellDef="let teacher">{{ teacher.grade }}</td>
        </ng-container>
        <ng-container matColumnDef="adress">
          <th mat-header-cell *matHeaderCellDef>Adress</th>
          <td mat-cell *matCellDef="let teacher">{{ teacher.adress }}</td>
        </ng-container>
        <ng-container matColumnDef="action">
          <th mat-header-cell *matHeaderCellDef>Action</th>
          <td mat-cell *matCellDef="let teacher">
            <button
              mat-icon-button
              matTooltip="Modifier"
              (click)="updateTeacher(teacher)"
            >
              <mat-icon color="primary">mode_edit</mat-icon>
            </button>
            <button
              mat-icon-button
              matTooltip="Supprimer"
              (click)="deleteTeacher(teacher.id)"
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

        <tr mat-row *matRowDef="let student; columns: displayedColumns"></tr>
        <tr
          mat-header-row
          *matHeaderRowDef="displayedColumns; sticky: true"
        ></tr>
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
export default class TeacherComponent {
  private fs = inject(FirestoreService);
  private authService = inject(AuthService);
  subscription!: Subscription;
  userSubScription!: Subscription;
  teacherCollection!: string;
  dialog = inject(MatDialog);
  newTeacher = NewTeacherComponent;
  dataSource = new MatTableDataSource<Teacher>();
  displayedColumns: string[] = [
    'id',
    'name',
    'lastname',
    'firstname',
    'grade',
    'gender',
    'adress',
    'action',
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  snackBar = inject(MatSnackBar);
  yearId!: string;
  ngOnInit() {
    const yearId = localStorage.getItem('yearId')!;
    this.yearId = yearId;
    this.userSubScription = this.authService.currentUser.subscribe((user) => {
      this.teacherCollection = this.fs.teacherCollection(
        this.yearId,
        user?.uid!
      );
      this.subscription = this.fs
        .getCollectionData(this.teacherCollection)
        .subscribe((docData) => {
          const teacher = docData as Teacher[];
          this.dataSource.data = teacher;
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        });
    });
  }
  updateTeacher(teacher: Teacher) {
    this.dialog.open(this.newTeacher, {
      hasBackdrop: true,
      disableClose: true,
      data: teacher,
    });
  }
  deleteTeacher(docId: string) {
    this.userSubScription = this.authService.currentUser.subscribe((user) => {
      const teacherCollection: string = this.fs.teacherCollection(
        this.yearId,
        user?.uid!
      );
      this.fs.deleteDocData(teacherCollection, docId);
      const notification = 'Enseignant effacé avec succès';
      this.snackBar.open(notification, '', { duration: 5000 });
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.userSubScription.unsubscribe();
  }
}
