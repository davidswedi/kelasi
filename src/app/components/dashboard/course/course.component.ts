import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderTableActionComponent } from '../../shared/components/header-table-action.component';
@Component({
  selector: 'app-course',
  standalone: true,
  imports: [CommonModule, HeaderTableActionComponent],
  template: `
    <app-header-table-action
      btnLabel="Nouveau Cours"
      searchPlaceholder="Cherchez par Nom"
    />
  `,
  styles: ``,
})
export default class CourseComponent {}
