import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  deleteDoc,
  doc,
  orderBy,
  query,
  setDoc,
  where,
  docData,
  getDoc,
} from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { AbstractControl } from '@angular/forms';
import { debounceTime, take, map } from 'rxjs/operators';
import { School } from '../../models/school.modei';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  private fs: Firestore = inject(Firestore);

  //Collections
  schoolCollection = 'school';

  //reference de la collection school et sous collection

  schoolColRef = collection(this.fs, this.schoolCollection);

  //creation ou modification d'un document dans firestore
  newSchool = (s: School) => setDoc(doc(this.schoolColRef, s.id), s);

  alreadyExistInputValidator(collectionName: string, fieldName: string) {
    return (control: AbstractControl) => {
      const value = control.value;
      const collectionRef = collection(this.fs, collectionName);
      const queryDoc = query(collectionRef, where(fieldName, '==', value));
      return collectionData(queryDoc).pipe(
        debounceTime(500),
        take(1),
        map((arr) => (arr.length ? { alreadyExist: true } : null))
      );
    };
  }

  async schoolExists(schoolId: string) {
    const schoolDocRef = doc(this.schoolColRef, schoolId);
    const schoolDoc = await getDoc(schoolDocRef);
    return schoolDoc.exists();
  }
}
