import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderTableActionComponent } from '../../shared/components/header-table-action.component';

@Component({
  selector: 'app-gestion-classe',
  standalone: true,
  template: `
    <app-header-table-action
      btnLabel="Nouvelle classe"
      searchPlaceholder="Rechercher par section "
    />
  `,
  styles: [],
  imports: [CommonModule, HeaderTableActionComponent],
})
export default class GestionClasseComponent {}
