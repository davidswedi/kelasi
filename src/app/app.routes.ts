import { Routes } from '@angular/router';
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
    path: 'dashboard',
    title: `Dashboard - ${appName}`,
    loadComponent: () => import('./components/dashboard/dashboard.component'),
    children: [
      {
        path: 'gestion-eleve',
        title: `Gestion des Eleves - ${appName}`,
        loadComponent: () =>
          import(
            './components/dashboard/gestion-eleve/gestion-eleve.component'
          ),
      },
      {
        path: 'gestion-prof',
        title: `Gestion des Enseignants - ${appName}`,
        loadComponent: () =>
          import('./components/dashboard/gestion-prof/gestion-prof.component'),
      },
      {
        path: 'gestion-cours',
        title: `Gestion des Cours - ${appName}`,
        loadComponent: () =>
          import(
            './components/dashboard/gestion-cours/gestion-cours.component'
          ),
      },
      {
        path: 'gestion-cotes',
        title: `Gestion des Cotes - ${appName}`,
        loadComponent: () =>
          import(
            './components/dashboard/gestion-cotes/gestion-cotes.component'
          ),
      },
      {
        path: 'gestion-classe',
        title: `Gestion des Classes - ${appName}`,
        loadComponent: () =>
          import(
            './components/dashboard/gestion-classe/gestion-classe.component'
          ),
      },
      {
        path: 'gestion-minerval',
        title: `Gestion de Minerval - ${appName}`,
        loadComponent: () =>
          import(
            './components/dashboard/gestion-minerval/gestion-minerval.component'
          ),
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'gestion-eleve',
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
