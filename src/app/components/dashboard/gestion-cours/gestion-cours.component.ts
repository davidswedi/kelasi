import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderTableActionComponent } from '../../shared/components/header-table-action.component';

@Component({
  selector: 'app-gestion-cours',
  standalone: true,
  template: ` <app-header-table-action
    btnLabel="Nouveau cours"
    searchPlaceholder="Rechercher par nom, post nom"
  />`,
  styles: [],
  imports: [CommonModule, HeaderTableActionComponent],
})
export default class GestionCoursComponent {}
