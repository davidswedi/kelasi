import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderTableActionComponent } from '../../shared/components/header-table-action.component';
@Component({
  selector: 'app-teacher',
  standalone: true,
  imports: [CommonModule, HeaderTableActionComponent],
  template: `
    <app-header-table-action
      btnLabel="Nouvel Enseignant"
      searchPlaceholder="Cherchez par Nom"
    />
  `,
  styles: ``,
})
export default class TeacherComponent {}
