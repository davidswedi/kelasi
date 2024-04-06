import { FieldValue, Timestamp } from '@angular/fire/firestore';

export interface Section {
  id: string;
  designation: string;
  cycle: string;
  createdAt: Timestamp | FieldValue;
}
