import { MatTooltipModule } from '@angular/material/tooltip';
import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderTableActionComponent } from '../../shared/components/header-table-action.component';
import { NewstudentComponent } from './newstudent/newstudent.component';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { FirestoreService } from 'src/app/core/services/firebase/firestore.service';
import { Student } from 'src/app/core/models/student.model';
import { Subscription } from 'rxjs';
import { MatSort } from '@angular/material/sort';
import { AuthService } from 'src/app/core/services/firebase/auth.service';
import { LetDirective } from '@ngrx/component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

@Component({
  selector: 'app-student',
  standalone: true,
  imports: [
    CommonModule,
    HeaderTableActionComponent,
    MatPaginatorModule,
    MatTableModule,
    LetDirective,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
  ],
  // animations: [
  //   trigger('detailExpanded', [
  //     state('expanded', style({ height: '0px', minHeight: '0' })),
  //     state('collapsed', style({ height: '*' })),
  //     transition(
  //       'expanded <=> collapsed',
  //       animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
  //     ),
  //   ]),
  // ],
  template: `
    <app-header-table-action
      btnLabel="Nouvel Elève"
      searchPlaceholder="Entrez le nom de l'élève"
      [dialogComponent]="newStudent"
      [collectionName]="studentCollection"
      [tableDataSource]="dataSource"
    />
    <div class="mat-elevation-z1">
      <table mat-table [dataSource]="dataSource" matSort multiTemplateDataRows>
        <!-- id Column -->
        <ng-container matColumnDef="id">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>No.</th>
          <td mat-cell *matCellDef="let student">
            {{ dataSource.filteredData.indexOf(student) + 1 }}
          </td>
        </ng-container>

        <!-- Name Column -->
        <ng-container matColumnDef="name">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Name</th>
          <td mat-cell *matCellDef="let student">{{ student.name }}</td>
        </ng-container>

        <!-- lastname Column -->
        <ng-container matColumnDef="lastname">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Lastname</th>
          <td mat-cell *matCellDef="let student">{{ student.lastname }}</td>
        </ng-container>

        <!-- gender Column -->
        <ng-container matColumnDef="gender">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Gender</th>
          <td mat-cell *matCellDef="let student">{{ student.gender }}</td>
        </ng-container>
        <ng-container matColumnDef="action">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Action</th>
          <td mat-cell *matCellDef="let student">
            <button
              mat-icon-button
              matTooltip="Modifier"
              (click)="updateStudent(student)"
            >
              <mat-icon color="primary">mode_edit</mat-icon>
            </button>
            <button
              mat-icon-button
              matTooltip="Supprimer"
              (click)="deleteStudent(student.id)"
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
  table {
  width: 100%;
}
// mat-icon{
//   margin:5px;
// }

  `,
})
export default class StudentComponent {
  expandeStudent?: Student | null;
  private fs = inject(FirestoreService);
  private authService = inject(AuthService);
  subscription!: Subscription;
  userSubScription!: Subscription;
  studentCollection!: string;
  // userSub!: Subscription;
  snackBar = inject(MatSnackBar);
  dialog = inject(MatDialog);
  newStudent = NewstudentComponent;

  displayedColumns: string[] = ['id', 'name', 'lastname', 'gender', 'action'];
  dataSource = new MatTableDataSource<Student>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  yearId!: string;

  ngOnInit() {
    const yearId = localStorage.getItem('yearId')!;
    this.yearId = yearId;
    this.userSubScription = this.authService.currentUser.subscribe((user) => {
      this.studentCollection = this.fs.studentCollection(
        this.yearId,
        user?.uid!
      );
      this.subscription = this.fs
        .getCollectionData(this.studentCollection)
        .subscribe((docData) => {
          const students = docData as Student[];
          this.dataSource.data = students;
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        });
    });
  }
  updateStudent(student: Student) {
    this.dialog.open(this.newStudent, {
      hasBackdrop: true,
      disableClose: true,
      data: student,
    });
  }
  deleteStudent(docId: string) {
    this.userSubScription = this.authService.currentUser.subscribe((user) => {
      const studentCollection: string = this.fs.studentCollection(
        this.yearId,
        user?.uid!
      );
      this.fs.deleteDocData(studentCollection, docId);
      const notification = 'Elève efface avec succès';
      this.snackBar.open(notification, '', { duration: 5000 });
    });
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.userSubScription.unsubscribe();
  }
}
