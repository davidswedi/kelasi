import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MediaQueryObserverService } from 'src/app/core/services/utilities/media-query-observer.service';
@Component({
  selector: 'app-landingpage',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    RouterModule,
    MatButtonModule,
    NgOptimizedImage,
    MatCardModule,
  ],
  template: `
    <mat-toolbar>
      <div class="left-container ">
        {{ appName }}
      </div>
      <div>
        <button class="btns" mat-raised-button>Se connecter</button>
        <button class="btns" mat-raised-button color="primary">
          S'incrire
        </button>
      </div>
    </mat-toolbar>
    <div class="container">
      <img
        width="900"
        height="500"
        ngSrc="https://infordc.com/storage/2022/04/IMG-20220406-WA0053-780x405.jpg"
        alt=""
      />
      <div class="description">
        <div class="desc">
          <h2>Kelasi</h2>
          <h1>Gérer votre Ecole avec Assurance</h1>
        </div>
        <div>
          Gerer d’une manière efficace et efficiante votre ecole en ayant en
          temps réel les informations de votre école. Nous offrons un espace
          convivial pour la gestion de votre école
        </div>
        <a routerLink="/dashboard"
          ><button class="btn" mat-raised-button color="primary">
            Soucrivez-vous maintenant
          </button></a
        >
      </div>
      <div>
        <img width="200" height="150" src="../assets/image/school.png" alt="" />
      </div>
    </div>
  `,
  styles: `
  
  mat-toolbar{
    display:flex;
    justify-content:space-between;
  }
  .detail{
    margin-left:4.8rem;
    max-width:800px;
  }
  .container{
    margin:4.8rem;
    display:flex;
    align-items:center;
    // justify-content:center;
  }
  .description{
    max-width:30%;
    padding:0.5rem;
   margin-left:30px;
  }
  .btns{
    margin:0.8rem;
  }
  img{
    border-radius:15px;
  }
  .btn{
    width:300px;
    height:50px;
    margin-top:2.8rem;
  }
  h1{
    font-size:50px;
  }
  
  `,
})
export default class LandingpageComponent {
  viewPoint$ = inject(MediaQueryObserverService).mediaQuery();
  appName = 'Kelasi';
}
