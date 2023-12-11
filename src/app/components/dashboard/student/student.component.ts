import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderTableActionComponent } from '../../shared/components/header-table-action.component';
import { NewstudentComponent } from './newstudent/newstudent.component';

@Component({
  selector: 'app-student',
  standalone: true,
  imports: [CommonModule, HeaderTableActionComponent],
  template: `
    <app-header-table-action
      btnLabel="Nouvel Elève"
      searchPlaceholder="Entrez le nom de l'élève"
      [dialogComponent]="newStudent"
    />
  `,
  styles: ``,
})
export default class StudentComponent {
  newStudent = NewstudentComponent;
}
