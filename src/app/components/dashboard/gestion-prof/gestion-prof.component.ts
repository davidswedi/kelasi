import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderTableActionComponent } from '../../shared/components/header-table-action.component';

@Component({
  selector: 'app-gestion-prof',
  standalone: true,
  template: `
    <app-header-table-action
      btnLabel="Nouvel enseignant"
      searchPlaceholder="Rechercher par nom, post nom"
    />
  `,
  styles: [],
  imports: [CommonModule, HeaderTableActionComponent],
})
export default class GestionProfComponent {}
