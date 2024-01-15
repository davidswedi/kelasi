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
import { Student } from '../../models/student.model';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  private fs: Firestore = inject(Firestore);

  //Get auto docId
  getDocId = (colName: string) => doc(collection(this.fs, colName)).id;

  //Collections
  schoolCollection = 'schools';
  studentCollection = (schoolId: string) =>
    `${this.schoolCollection}/${schoolId}/students`;

  //reference de la collection school et sous collection

  schoolColRef = collection(this.fs, this.schoolCollection);
  studentColRef = (shoolId: string) =>
    collection(this.fs, this.studentCollection(shoolId));

  //creation ou modification d'un document dans firestore
  newSchool = (s: School) => setDoc(doc(this.schoolColRef, s.id), s);
  newStudent = (s: Student, schoolId: string) =>
    setDoc(doc(this.studentColRef(schoolId), s.id), s);

  // Recuperer les donnees d'une colletion

  getCollectionData(ColName: string) {
    const collectionRef = collection(this.fs, ColName);
    const queryDocByDate = query(collectionRef, orderBy('createdAt', 'desc'));
    return collectionData(queryDocByDate);
  }
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
