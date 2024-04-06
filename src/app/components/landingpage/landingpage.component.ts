import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatSidenavModule } from '@angular/material/sidenav';
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
    MatSidenavModule,
  ],
  template: `
    <mat-toolbar>
      <div class="left-container ">
        {{ appName }}
      </div>
      <div>
        <button class="btns" mat-flat-button>
          <a mat-button routerLink="/login">Se connecter</a>
        </button>
        <button class="btns" mat-flat-button color="primary">S'incrire</button>
      </div>
    </mat-toolbar>
    <div class="container">
      <!-- <img
        ngSrc="https://infordc.com/storage/2022/04/IMG-20220406-WA0053-780x405.jpg"
        alt=""
      /> -->
      <div class="img-section">
        <img src="../../assets/image/kelasi.jpg" alt="" />
      </div>

      <div class="description">
        <div class="desc">
          <h2>Kelasi</h2>
          <h1>Gérer votre Ecole avec Assurance</h1>
        </div>
        <div class="h3">
          Gerer d’une manière efficace et efficiante votre ecole en ayant en
          temps réel les informations de votre école. Nous offrons un espace
          convivial pour la gestion de votre école
        </div>
        <a routerLink="/signup"
          ><button class="btn" mat-flat-button color="primary">
            Soucrivez-vous maintenant
          </button></a
        >
      </div>
    </div>
  `,
  styles: `
  body{
    // background:#fff;
    background:linear-gradient(45deg,blue,white);
  }
  mat-toolbar{
    display:flex;
    justify-content:space-between;
  }
  .container{
    width:100%;
    margin:2em 5em;
    // gap:2em;
    display:flex;
    // flex-direction:column;
  }
  .container .img-section{
    width:60%;
  }
  img{
    width:90%;
    border-radius:7px;
  }
  .container .description{
    width:30%;
  }
  .btns{
    margin:0.8rem;
  }
  .btn{
    width:300px;
    height:50px;
    margin-top:2.8rem;
  }
  h1{
    font-size:25px;
  }
  .h3{
    font-size:20px;
  }

  @media only screen and (max-width:1000px){
    .container{
      flex-direction:column;
    }
  }
  @media only screen and (max-width:1000px){
    .container .img-section{
    width:90%;
  }
  img{
    width:90%;
    border-radius:7px;
  }
  .container .description{
    width:90%;
  }
  }
  @media only screen and (max-width:640px){
    .container{
    margin:2em 1em;
  }
    .container .img-section{
    width:100%;
  }
  img{
    width:90%;
    border-radius:7px;
  }
  .container .description{
    width:90%;
  }
  }
  `,
})
export default class LandingpageComponent {
  viewPoint$ = inject(MediaQueryObserverService).mediaQuery();
  appName = 'Kelasi';
}
