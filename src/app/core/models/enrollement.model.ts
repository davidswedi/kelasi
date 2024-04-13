import { FieldValue, Timestamp } from '@angular/fire/firestore';

export interface Enrollement {
  id: string;
  studentId: string;
  classId: string;
  documents: string;
  createdAt: Timestamp | FieldValue;
}
