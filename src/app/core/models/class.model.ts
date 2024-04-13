import { FieldValue, Timestamp } from '@angular/fire/firestore';

export interface Class {
  id: string;
  designation: string;
  sectionId: string;
  createdAt: Timestamp | FieldValue;
}
