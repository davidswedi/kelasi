import { School } from './../../core/models/school.modei';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { appTitle } from 'src/app/app.config';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { LetDirective } from '@ngrx/component';
import { MediaQueryObserverService } from 'src/app/core/services/utilities/media-query-observer.service';
import { SwitchthemeService } from 'src/app/core/services/utilities/switchtheme.service';
import { Component, inject } from '@angular/core';
import { AuthService } from 'src/app/core/services/firebase/auth.service';
import { Subscription } from 'rxjs';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { User } from '@angular/fire/auth';
import { FirestoreService } from 'src/app/core/services/firebase/firestore.service';
import { docData } from '@angular/fire/firestore';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    RouterModule,
    NgOptimizedImage,
    MatSidenavModule,
    MatMenuModule,
    MatDividerModule,
    LetDirective,
    MatSnackBarModule,
  ],
  template: `
    <div class="dashboard-container">
      <mat-toolbar>
        <div class="left-container ">
          @if ( (viewPoint$ | async) === 'XSmall' || (viewPoint$ | async) ===
          'Small' || (viewPoint$ | async) === 'Medium' ) {
          <button
            (click)="drawer.toggle()"
            mat-icon-button
            matTooltip="Elargir le menu"
          >
            <mat-icon>menu</mat-icon>
          </button>
          }
          <a mat-button routeLink="/gestion-eleve">{{ appName }}</a>
        </div>
        <img
          [mat-menu-trigger-for]="menu"
          [matTooltip]="'Menu de ' + appName"
          width="35"
          height="35"
          [ngSrc]="
            (user$ | async)?.photoURL ??
            'https://images.vexels.com/content/145908/preview/male-avatar-maker-2a7919.png'
          "
          alt=""
        />
        <mat-menu #menu="matMenu">
          <button mat-menu-item>
            <mat-icon>manage_accounts</mat-icon>
            <span>Gerer votre Compte</span>
          </button>
          <button mat-menu-item [matMenuTriggerFor]="theme">
            <mat-icon>dark_mode</mat-icon>
            <span>Theme</span>
          </button>
          <mat-divider></mat-divider>
          <button mat-menu-item (click)="logOut()">
            <mat-icon>logout</mat-icon>
            <span>Se deconnecter</span>
          </button>
        </mat-menu>

        <mat-menu #theme="matMenu">
          <button (click)="switchTheme('device-theme')" mat-menu-item>
            Theme de l'appareil
          </button>
          <button (click)="switchTheme('light-theme')" mat-menu-item>
            Theme clair
          </button>
          <button (click)="switchTheme('dark-theme')" mat-menu-item>
            Theme sombre
          </button>
        </mat-menu>
      </mat-toolbar>
      <mat-drawer-container>
        <mat-drawer
          #drawer
          [mode]="
            (viewPoint$ | async) === 'Large' ||
            (viewPoint$ | async) === 'XLarge'
              ? 'side'
              : 'over'
          "
          [opened]="
            (viewPoint$ | async) === 'Large' ||
            (viewPoint$ | async) === 'XLarge'
          "
        >
          <!-- <img width="40" height="40" alt="School Image" /> -->
          <h3 class="app-name">{{ schoolName }}</h3>
          <a
            mat-flat-button
            extended
            class="link"
            routerLink="dash-dashboard"
            routerLinkActive
            #rla10="routerLinkActive"
            [color]="rla10.isActive ? 'primary' : 'no-color'"
            *ngrxLet="viewPoint$ as vw"
            (click)="toggleDrawer(drawer, vw)"
            ><mat-icon>dashboard</mat-icon>Dashboard</a
          >
          <a
            mat-flat-button
            extended
            class="link"
            routerLink="student"
            routerLinkActive
            #rla="routerLinkActive"
            [color]="rla.isActive ? 'primary' : 'no-color'"
            *ngrxLet="viewPoint$ as vw"
            (click)="toggleDrawer(drawer, vw)"
            ><mat-icon>school</mat-icon>Eleves</a
          >
          <a
            mat-flat-button
            extended
            class="link"
            routerLink="enrollment"
            routerLinkActive
            #rla1="routerLinkActive"
            [color]="rla1.isActive ? 'primary' : 'no-color'"
            *ngrxLet="viewPoint$ as vw"
            (click)="toggleDrawer(drawer, vw)"
            ><mat-icon>app_registration</mat-icon>Inscription</a
          >
          <a
            mat-flat-button
            extended
            class="link"
            routerLink="course"
            routerLinkActive
            #rla2="routerLinkActive"
            [color]="rla2.isActive ? 'primary' : 'no-color'"
            *ngrxLet="viewPoint$ as vw"
            (click)="toggleDrawer(drawer, vw)"
            ><mat-icon>menu_book</mat-icon>Cours</a
          >
          <a
            mat-flat-button
            extended
            class="link"
            routerLink="teacher"
            routerLinkActive
            #rla3="routerLinkActive"
            [color]="rla3.isActive ? 'primary' : 'no-color'"
            *ngrxLet="viewPoint$ as vw"
            (click)="toggleDrawer(drawer, vw)"
            ><mat-icon>person</mat-icon>Enseignants</a
          >
          <a
            mat-flat-button
            extended
            class="link"
            routerLink="section"
            routerLinkActive
            #rla8="routerLinkActive"
            [color]="rla8.isActive ? 'primary' : 'no-color'"
            *ngrxLet="viewPoint$ as vw"
            (click)="toggleDrawer(drawer, vw)"
            ><mat-icon>auto_stories</mat-icon>Sections</a
          >
          <a
            mat-flat-button
            extended
            class="link"
            routerLink="classes"
            routerLinkActive
            #rla4="routerLinkActive"
            [color]="rla4.isActive ? 'primary' : 'no-color'"
            *ngrxLet="viewPoint$ as vw"
            (click)="toggleDrawer(drawer, vw)"
            ><mat-icon>meeting_room</mat-icon>Classes</a
          >
          <a
            mat-flat-button
            extended
            class="link"
            routerLink="fees"
            routerLinkActive
            #rla5="routerLinkActive"
            [color]="rla5.isActive ? 'primary' : 'no-color'"
            *ngrxLet="viewPoint$ as vw"
            (click)="toggleDrawer(drawer, vw)"
            ><mat-icon>attach_money</mat-icon>Minerval
          </a>
          <a
            mat-flat-button
            extended
            class="link"
            routerLink="manage-marks"
            routerLinkActive
            #rla6="routerLinkActive"
            [color]="rla6.isActive ? 'primary' : 'no-color'"
            *ngrxLet="viewPoint$ as vw"
            (click)="toggleDrawer(drawer, vw)"
            ><mat-icon>calculate</mat-icon>Cotes</a
          >
          <a
            mat-flat-button
            extended
            class="link"
            routerLink="settings"
            routerLinkActive
            #rla7="routerLinkActive"
            [color]="rla7.isActive ? 'primary' : 'no-color'"
            *ngrxLet="viewPoint$ as vw"
            (click)="toggleDrawer(drawer, vw)"
            ><mat-icon>settings</mat-icon>Parametres</a
          >
        </mat-drawer>
        <mat-drawer-content><router-outlet /></mat-drawer-content>
      </mat-drawer-container>
    </div>
  `,
  styles: [
    `
      .app-name {
        margin: 0.9rem;
      }
      .dashboard-container {
        height: 100vh;
        display: flex;
        flex-direction: column;
      }
      .toolbar-container {
        position: sticky;
        top: 0%;
        z-index: 2;
      }

      mat-toolbar {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .left-container {
          display: flex;
          align-items: center;
        }
      }

      img {
        border-radius: 50%;
        background: lightgray;
        cursor: pointer;
        transition: 250ms;

        &:hover {
          transform: scale(1.1);
        }
      }
      mat-drawer-container {
        flex-basis: 100%;
      }
      mat-drawer {
        width: 17rem;
      }

      .link {
        width: 100%;
        height: 3rem;
        border-radius: 0;
        margin-bottom: 0.2rem;
        display: flex;
        justify-content: flex-start;
        box-shadow: none;
      }
    `,
  ],
})
export default class DashboardComponent {
  schoolName!: string;
  schoolUrl!: string;
  schoolCollection!: string;
  appName = appTitle;
  viewPoint$ = inject(MediaQueryObserverService).mediaQuery();
  sts = inject(SwitchthemeService);
  fs = inject(FirestoreService);
  private authService = inject(AuthService);
  user$ = this.authService.currentUser;
  authState$ = this.authService.authState;
  authStateSubscription!: Subscription;
  snackBar = inject(MatSnackBar);
  router = inject(Router);
  yearId!: string | null;
  subscription!: Subscription;
  ngOnInit(): void {
    const yearId = localStorage.getItem('yearId');
    this.yearId = yearId;
    this.authStateSubscription = this.authState$.subscribe(
      async (user: User | null) => {
        if (user) {
          if (!(await this.fs.schoolExists(user.uid))) {
            this.router.navigate(['/signup']);
            this.snackBar.open(
              "Veuillez terminer l'inscription de votre ecole ",
              'OK'
            );
          }
        }
      }
    );
    this.schoolCollection = this.fs.schoolCollection;
    this.user$.subscribe((user) => {
      const userId = user?.uid!;
      this.fs
        .getCollectionDataById(this.schoolCollection, userId)
        .subscribe((docData) => {
          const school = docData as School[];
          this.schoolName = school[0].name;
          this.schoolUrl = school[0].logoUrlImg;
        });
    });
  }

  ngOnDestroy() {
    this.authStateSubscription.unsubscribe();
  }

  logOut = async () => {
    await this.authService.logout();
    this.router.navigate(['/login']);
  };

  toggleDrawer(drawer: MatDrawer, viewPoint: string) {
    if (viewPoint === 'Large' || viewPoint === 'XLarge') {
      return null;
    } else {
      return drawer?.toggle();
    }
  }
  switchTheme = (theme: string) => this.sts.swithcTheme(theme);
}
