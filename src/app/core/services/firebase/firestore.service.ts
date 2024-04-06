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
import { Teacher } from '../../models/teacher.model';
import { Section } from '../../models/section.model';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  private fs: Firestore = inject(Firestore);

  //Get auto docId
  getDocId = (colName: string) => doc(collection(this.fs, colName)).id;

  //Collections
  schoolCollection = 'schools';

  academicYearCollection = (schoolId: string) =>
    `${this.schoolCollection}/${schoolId}/schoolyears`;

  studentCollection = (YearId: string, schoolId: string) =>
    `${this.academicYearCollection(schoolId)}/${YearId}/student`;

  teacherCollection = (YearId: string, schoolId: string) =>
    `${this.academicYearCollection(schoolId)}/${YearId}/teacher`;

  sectionCollection = (YearId: string, schoolId: string) =>
    `${this.academicYearCollection(schoolId)}/${YearId}/section`;

  //reference de la collection school et sous collection

  schoolColRef = collection(this.fs, this.schoolCollection);

  academicYearRef = (SchoolId: string) =>
    collection(this.fs, this.academicYearCollection(SchoolId));

  // studentRef = (YearId: string) => collection(this.fs, this.studentCol(YearId));

  studentColRef = (YearId: string, schoolId: string) =>
    collection(this.fs, this.studentCollection(YearId, schoolId));

  //Reference de la collection de l'enseignant
  teacherColRef = (YearId: string, schoolId: string) =>
    collection(this.fs, this.teacherCollection(YearId, schoolId));

  sectionColRef = (YearId: string, schoolId: string) =>
    collection(this.fs, this.sectionCollection(YearId, schoolId));

  //creation ou modification d'un document dans firestore
  newSchool = (s: School) => setDoc(doc(this.schoolColRef, s.id), s);

  newStudent = (s: Student, YearId: string, choolId: string) =>
    setDoc(doc(this.studentColRef(YearId, choolId), s.id), s);

  newTeacher = (s: Teacher, YearId: string, schoolId: string) =>
    setDoc(doc(this.teacherColRef(YearId, schoolId), s.id), s);

  newSection = (s: Section, YearId: string, schoolId: string) =>
    setDoc(doc(this.sectionColRef(YearId, schoolId), s.id), s);
  // Recuperer les donnees d'une colletion

  getCollectionData(ColName: string) {
    const collectionRef = collection(this.fs, ColName);
    const queryDocByDate = query(collectionRef, orderBy('createdAt', 'desc'));
    return collectionData(queryDocByDate);
  }

  //effacer un document d'une collection

  deleteDocData(collectionName: string, docId: string) {
    const docRef = doc(this.fs, collectionName, docId);
    deleteDoc(docRef);
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
