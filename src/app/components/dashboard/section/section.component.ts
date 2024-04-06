import { Subscription } from 'rxjs';
import { Component, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderTableActionComponent } from '../../shared/components/header-table-action.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { NewSectionComponent } from './new-section/new-section.component';
import { Section } from 'src/app/core/models/section.model';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from 'src/app/core/services/firebase/auth.service';
import { FirestoreService } from 'src/app/core/services/firebase/firestore.service';
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'app-section',
  standalone: true,
  imports: [
    CommonModule,
    HeaderTableActionComponent,
    MatIconModule,
    MatPaginatorModule,
    MatTableModule,
    MatButtonModule,
  ],
  template: `
    <app-header-table-action
      btnLabel="Nouvelle Section "
      searchPlaceholder="Cherchez la section par nom"
      [dialogComponent]="newSection"
      [collectionName]="sectionCollection"
      [tableDataSource]="dataSource"
    />
    <div class="mat-elevation-z1">
      <table mat-table [dataSource]="dataSource" matSort multiTemplateDataRows>
        <!-- id Column -->
        <ng-container matColumnDef="id">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>No.</th>
          <td mat-cell *matCellDef="let section">
            {{ dataSource.filteredData.indexOf(section) + 1 }}
          </td>
        </ng-container>

        <!-- Name Column -->
        <ng-container matColumnDef="designation">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Designation</th>
          <td mat-cell *matCellDef="let section">{{ section.designation }}</td>
        </ng-container>

        <!-- lastname Column -->
        <ng-container matColumnDef="cycle">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Cycle</th>
          <td mat-cell *matCellDef="let section">{{ section.cycle }}</td>
        </ng-container>

        <ng-container matColumnDef="action">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Action</th>
          <td mat-cell *matCellDef="let section">
            <button
              mat-icon-button
              matTooltip="Modifier"
              (click)="updateSection(section)"
            >
              <mat-icon color="primary">mode_edit</mat-icon>
            </button>
            <button
              mat-icon-button
              matTooltip="Supprimer"
              (click)="deleteSection(section.id)"
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
export default class SectionComponent {
  sectionCollection!: string;
  private auth = inject(AuthService);
  snackBar = inject(MatSnackBar);
  dialog = inject(MatDialog);
  newSection = NewSectionComponent;
  displayedColumns: string[] = ['id', 'designation', 'cycle', 'action'];
  dataSource = new MatTableDataSource<Section>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  yearId!: string;
  subscription!: Subscription;
  userSubScription!: Subscription;
  private fs = inject(FirestoreService);

  ngOnInit() {
    const yearId = localStorage.getItem('yearId')!;
    this.yearId = yearId;

    this.userSubScription = this.auth.currentUser.subscribe((user) => {
      this.sectionCollection = this.fs.sectionCollection(
        this.yearId,
        user?.uid!
      );
      this.subscription = this.fs
        .getCollectionData(this.sectionCollection)
        .subscribe((docData) => {
          const sections = docData as Section[];
          this.dataSource.data = sections;
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        });
    });
  }

  updateSection(section: Section) {
    this.dialog.open(this.newSection, {
      hasBackdrop: true,
      disableClose: true,
      data: section,
    });
  }
  deleteSection(docId: string) {
    this.userSubScription = this.auth.currentUser.subscribe((user) => {
      const sectionCollection: string = this.fs.sectionCollection(
        this.yearId,
        user?.uid!
      );
      this.fs.deleteDocData(sectionCollection, docId);
      const notification = 'Section effacée avec succès';
      this.snackBar.open(notification, '', { duration: 5000 });
    });
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.userSubScription.unsubscribe();
  }
}
