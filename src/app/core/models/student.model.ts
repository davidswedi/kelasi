import { FieldValue, Timestamp } from '@angular/fire/firestore';
export interface Student {
  id: number;
  name: string;
  lastname: string;
  firstname: string;
  gender: string;
  address: string;
  PhotoUrl: string;
  createdAt: Date | Timestamp | FieldValue;
}
