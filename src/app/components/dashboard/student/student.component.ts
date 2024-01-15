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
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-student',
  standalone: true,
  imports: [
    CommonModule,
    HeaderTableActionComponent,
    MatPaginatorModule,
    MatTableModule,
    LetDirective,
  ],
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
          <th mat-header-cell *matHeaderCellDef>No.</th>
          <td mat-cell *matCellDef="let student">
            {{ dataSource.filteredData.indexOf(student) + 1 }}
          </td>
        </ng-container>

        <!-- Name Column -->
        <ng-container matColumnDef="name">
          <th mat-header-cell *matHeaderCellDef>Name</th>
          <td mat-cell *matCellDef="let student">{{ student.name }}</td>
        </ng-container>

        <!-- lastname Column -->
        <ng-container matColumnDef="lastname">
          <th mat-header-cell *matHeaderCellDef>Lastname</th>
          <td mat-cell *matCellDef="let student">{{ student.lastname }}</td>
        </ng-container>

        <!-- gender Column -->
        <ng-container matColumnDef="gender">
          <th mat-header-cell *matHeaderCellDef>Gender</th>
          <td mat-cell *matCellDef="let student">{{ student.gender }}</td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>

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

  `,
})
export default class StudentComponent {
  private fs = inject(FirestoreService);
  private authService = inject(AuthService);
  subscription!: Subscription;
  userSubScription!: Subscription;
  studentCollection!: string;

  newStudent = NewstudentComponent;

  displayedColumns: string[] = ['id', 'name', 'lastname', 'gender'];
  dataSource = new MatTableDataSource<Student>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit() {
    this.userSubScription = this.authService.currentUser.subscribe((user) => {
      this.studentCollection = this.fs.studentCollection(user?.uid!);
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

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.userSubScription.unsubscribe();
  }
}
