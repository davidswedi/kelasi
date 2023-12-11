import { User } from '@angular/fire/auth';
import { FieldValue, Timestamp } from '@angular/fire/firestore';
export interface School {
  id: string;
  name: string;
  description: string;
  email: string;
  phone: string;
  logoUrlImg: string;
  owner: Partial<User>;
  created: Timestamp | Date | FieldValue;
}
