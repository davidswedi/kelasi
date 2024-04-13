import { docData } from '@angular/fire/firestore';
import { Teacher } from './../../../core/models/teacher.model';
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { Student } from 'src/app/core/models/student.model';
import { Class } from 'src/app/core/models/class.model';
import { AuthService } from 'src/app/core/services/firebase/auth.service';
import { FirestoreService } from 'src/app/core/services/firebase/firestore.service';
import { Enrollement } from 'src/app/core/models/enrollement.model';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-dash-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  template: `
    <div class="data">
      <mat-card color="primary">
        <mat-card-content>
          <div class="disp" color="primary">
            <mat-icon color="primary">school</mat-icon>
            <h3>{{ totalStudent }}</h3>
          </div>
          <p>Elèves</p>
        </mat-card-content>
      </mat-card>
      <mat-card>
        <mat-card-content>
          <div class="disp">
            <mat-icon>groups</mat-icon>
            <h3>{{ totalEnroll }}</h3>
          </div>
          <p>Inscrits</p>
        </mat-card-content>
      </mat-card>
      <mat-card>
        <mat-card-content>
          <div class="disp">
            <mat-icon>person</mat-icon>
            <h3>{{ totaLteacher }}</h3>
          </div>
          <p>Enseignants</p>
        </mat-card-content>
      </mat-card>
      <mat-card>
        <mat-card-content>
          <div class="disp">
            <mat-icon color="primary">meeting_room</mat-icon>
            <h3>{{ totalEnroll }}</h3>
          </div>
          <p>Classes</p>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: `
  .data{
    display:flex;
    width:100vh;
    margin:0px auto;
    margin-top:4rem;
    align-items:center;
    flex-wrap:wrap;
  }
  @media screen and (max-width: 600px) {
    .data{
      flex-direction:column;
      width:100%;
      margin-top:1rem;
      mat-card{
        margin:5px;
        width:80%;
        height:150px;
     }
    }
}  

  mat-card{
    margin:10px;
    width:35%;
    height:150px;
  }
  .disp{
    display:flex;
    align-items:center;
    gap:10px;
  }
  
  `,
})
export default class DashDashboardComponent {
  yearId!: string;
  userSubscription!: Subscription;
  subscription!: Subscription;
  studentCollection!: string;
  classCollection!: string;
  auth = inject(AuthService);
  fs = inject(FirestoreService);
  Students: Student[] = [];
  Classes: Class[] = [];
  Teacher: Teacher[] = [];
  Enroll: Enrollement[] = [];
  enrollementCollection!: string;
  teacherCollection!: string;

  totaLteacher: number = 0;
  totalStudent: number = 0;
  totalClass: number = 0;
  totalEnroll: number = 0;
  ngOnInit() {
    const yearId = localStorage.getItem('yearId')!;
    this.yearId = yearId;

    this.userSubscription = this.auth.currentUser.subscribe((user) => {
      this.studentCollection = this.fs.studentCollection(
        this.yearId,
        user?.uid!
      );
      this.subscription = this.fs
        .getCollectionData(this.studentCollection)
        .subscribe((docData) => {
          const students = docData as Student[];
          this.totalStudent = students.length;
        });
    });

    this.userSubscription = this.auth.currentUser.subscribe((user) => {
      this.classCollection = this.fs.classCollection(this.yearId, user?.uid!);
      this.subscription = this.fs
        .getCollectionData(this.classCollection)
        .subscribe((docData) => {
          const classes = docData as Class[];
          this.totalClass = classes.length;
        });
    });

    this.userSubscription = this.auth.currentUser.subscribe((user) => {
      this.enrollementCollection = this.fs.enrollementCollection(
        this.yearId,
        user?.uid!
      );
      this.subscription = this.fs
        .getCollectionData(this.enrollementCollection)
        .subscribe((docData) => {
          const enrolls = docData as Enrollement[];
          this.totalEnroll = enrolls.length;
        });
    });

    this.userSubscription = this.auth.currentUser.subscribe((user) => {
      this.teacherCollection = this.fs.teacherCollection(
        this.yearId,
        user?.uid!
      );
      this.subscription = this.fs
        .getCollectionData(this.teacherCollection)
        .subscribe((docData) => {
          const teacher = docData as Teacher[];
          this.totaLteacher = teacher.length;
        });
    });
  }
}
