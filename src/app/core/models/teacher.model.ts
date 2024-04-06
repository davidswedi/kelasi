import { FieldValue, Timestamp } from '@angular/fire/firestore';

export interface Teacher {
  id: string;
  name: string;
  lastname: string;
  firstname: string;
  grade: string;
  gender: string;
  adress: string;
  PhotoUrl: string;
  createdAt: Date | Timestamp | FieldValue;
}
