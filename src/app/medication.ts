import { MedicationModel } from './models/medication-model';
import { db } from './firebase.config';
import { Injectable, signal } from '@angular/core';
import { addDoc, collection, onSnapshot } from 'firebase/firestore';



@Injectable({
  providedIn: 'root',
})
export class Medication {

  medications = signal<MedicationModel[]>([]);

  

  // Firestore collection reference for medications
  collectionRef = collection(db, 'medications');
  
  async addMedication(medication: MedicationModel) {
    await addDoc(this.collectionRef, medication);
  } 

  // loadMedications( ) - Fetches all medication documents from Firestore and converts them into usable objects
  loadMedications() {
    onSnapshot(this.collectionRef, (snapshot) => {
      const data = snapshot.docs.map(doc => {
        const med = doc.data() as MedicationModel;

        return {
          ...med,
          id: doc.id
        };
      });

      this.medications.set(data);
    });
  }

constructor() {
  this.loadMedications();
}
}
