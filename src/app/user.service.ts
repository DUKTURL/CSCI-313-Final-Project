import { Injectable, signal, effect } from '@angular/core';
import { addDoc, collection, deleteDoc, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from './firebase.config';

export interface User {
  id?: string; //optional property exists only in the angular app
  // Holds the Firestore document ID (doc.id) in the Angular app.
  // This value is NOT stored as a field in Firestore documents.
  // It is added when reading data from Firestore and is used
  // to identify a user for update and delete operations.
  name: string;
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  //signal property call users of array of Users type.
  users = signal<User[]>([]);
  currentUser = signal<User | null>(JSON.parse(localStorage.getItem('currentUser') || 'null'));

  userCollection = collection(db, 'users');

  constructor() {
    effect(() => {
      const user = this.currentUser();

      if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
      } else {
        localStorage.removeItem('currentUser');
      }
    });
  }

  //loadUsers( ) - Fetches (READ) all user documents from Firestore, converts them
  // into usable objects, and update the Angular signal so the UI reacts automatically.
  loadUsers() {
    onSnapshot(this.userCollection, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      })) as User[];
      this.users.set(data);
    });
  }

  //CREATE
  async addUser(user: User) {
    await addDoc(this.userCollection, user);
  }

  //UPDATE
  async updateUser(id: string, user: Partial<User>) {
    const userRef = doc(db, 'users', id); //document reference
    await updateDoc(userRef, user);
  }

  //DELETE
  async deleteUser(id: string) {
    const userRef = doc(db, 'users', id);
    await deleteDoc(userRef);
  }

  getCurrentUser(): User | null {
    return this.currentUser();
  }
}
