import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderTableActionComponent } from '../../shared/components/header-table-action.component';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-course',
  standalone: true,
  imports: [
    CommonModule,
    HeaderTableActionComponent,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
  ],
  template: `
    <app-header-table-action
      btnLabel="Nouveau Cours"
      searchPlaceholder="Cherchez par Nom"
    />
    <div class="mat-elevation-z1">
      <table mat-table matSort multiTemplateDataRows>
        <!-- id Column -->
        <ng-container matColumnDef="id">
          <th mat-header-cell *matHeaderCellDef>No.</th>
          <td mat-cell *matCellDef="let student">
            {{ 1 }}
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
        <ng-container matColumnDef="action">
          <th mat-header-cell *matHeaderCellDef>Action</th>
          <td mat-cell *matCellDef="let student">
            <button mat-icon-button matTooltip="Modifier">
              <mat-icon color="primary">mode_edit</mat-icon>
            </button>
            <button mat-icon-button matTooltip="Supprimer">
              <mat-icon>delete</mat-icon>
            </button>
          </td>
        </ng-container>
        <ng-container matColumnDef="expandDetail">
          <td
            mat-cell
            *matCellDef="let student"
            [attr.colspan]="displayedColumns.length"
          ></td>
        </ng-container>

        <tr mat-row *matRowDef="let student; columns: displayedColumns"></tr>
        <tr
          mat-row
          *matRowDef="let student; columns: ['expandDetail']"
          class="detail-row"
        ></tr>

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
export default class CourseComponent {
  displayedColumns: string[] = [
    'id',
    'Intitule',
    'Volume Horaire',
    'Classe',
    'action',
  ];
}
