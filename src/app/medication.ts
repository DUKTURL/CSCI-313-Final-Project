import { MedicationModel } from './models/medication-model';
import { db } from './firebase.config';
import { Injectable, signal } from '@angular/core';
import { addDoc, collection, onSnapshot, doc, updateDoc } from 'firebase/firestore';



@Injectable({
  providedIn: 'root',
})
export class Medication {
  medications = signal<MedicationModel[]>([]);

  // Firestore collection reference for medications
  collectionRef = collection(db, 'medications');

  //adds a new medication document to Firestore using the provided medication object
  async addMedication(medication: MedicationModel) {
    await addDoc(this.collectionRef, medication);
  } 

  //updates a medication document in Firestore to add a date to the dates_taken array
  async markMedicationTaken(id: string, date: string, dates_taken: string[]) {

    const medicationRef = doc(db, 'medications', id);

    await updateDoc(medicationRef, {
      dates_taken: [...dates_taken, date]
    });
  }

  //updates a medication document in Firestore to remove a date from the dates_taken array
  async updateMedicationDates(id: string, dates: string[]) {

    const ref = doc(db, 'medications', id);

    await updateDoc(ref, {
      dates_taken: dates
    });
  }

  // loadMedications( ) - Fetches all medication documents from Firestore and converts them into usable objects
  loadMedications() {
    onSnapshot(this.collectionRef, (snapshot) => {
      const data = snapshot.docs.map((doc) => {
        const med = doc.data() as MedicationModel;

        return {
          ...med,
          id: doc.id,
        };
      });

      this.medications.set(data);
    });
  }

  // constructor calls loadMedications to initialize the medications signal but limiting it to only run once when the service is created
  constructor() {
    this.loadMedications();
  }
}
