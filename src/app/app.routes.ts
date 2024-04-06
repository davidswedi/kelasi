import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { AuthService } from './core/services/firebase/auth.service';
import { User } from '@angular/fire/auth';
const appName = 'Kelasi';
export const routes: Routes = [
  {
    path: '',
    title: `Acceuil - ${appName}`,
    loadComponent: () =>
      import('./components/landingpage/landingpage.component'),
  },
  {
    path: 'login',
    title: `Login - ${appName}`,
    loadComponent: () => import('./components/auth/login/login.component'),
  },
  {
    path: 'signup',
    title: `Inscription - ${appName}`,
    loadComponent: () => import('./components/auth/signup/signup.component'),
  },
  {
    path: 'email-link-rediraction',
    title: `Redirection Email Link - ${appName}`,
    loadComponent: () =>
      import('./components/auth/email-link-rediraction.component'),
  },
  {
    path: 'choose-year',
    title: 'Année scolaire',
    loadComponent: () =>
      import('./components/choose-year/choose-year.component'),
  },
  {
    path: 'dashboard',
    title: `Dashboard - ${appName}`,
    canActivate: [() => inject(AuthService).isLoggedIn()],
    loadComponent: () => import('./components/dashboard/dashboard.component'),
    children: [
      {
        path: 'student',
        title: `Gestion des Eleves - ${appName}`,
        loadComponent: () =>
          import('./components/dashboard/student/student.component'),
      },
      {
        path: 'enrollment',
        title: `Gestion d'inscription' - ${appName}`,
        loadComponent: () =>
          import('./components/dashboard/enrollment/enrollment.component'),
      },
      {
        path: 'teacher',
        title: `Gestion des Enseignants - ${appName}`,
        loadComponent: () =>
          import('./components/dashboard/teacher/teacher.component'),
      },
      {
        path: 'course',
        title: `Gestion des Cours - ${appName}`,
        loadComponent: () =>
          import('./components/dashboard/course/course.component'),
      },
      {
        path: 'manage-marks',
        title: `Gestion des Cotes - ${appName}`,
        loadComponent: () =>
          import('./components/dashboard/manage-marks/manage-marks.component'),
      },
      {
        path: 'classes',
        title: `Gestion des Classes - ${appName}`,
        loadComponent: () =>
          import('./components/dashboard/classes/classes.component'),
      },
      {
        path: 'section',
        title: `Gestion des Sections - ${appName}`,
        loadComponent: () =>
          import('./components/dashboard/section/section.component'),
      },
      {
        path: 'fees',
        title: `Gestion de Minerval - ${appName}`,
        loadComponent: () =>
          import('./components/dashboard/fees/fees.component'),
      },
      {
        path: 'settings',
        title: `Paramètres - ${appName}`,
        loadComponent: () =>
          import('./components/dashboard/settings/settings.component'),
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'student',
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
