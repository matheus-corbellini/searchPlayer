import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../lib/firebaseconfig";
import type { User } from "../types/User";

class FirestoreService {
  private readonly USERS_COLLECTION = "users";

  async saveUser(user: User): Promise<void> {
    const userRef = doc(db, this.USERS_COLLECTION, user.uid);
    const userData = {
      ...user,
      id: user.uid, // Ensure id is set to uid
      updatedAt: new Date(),
      createdAt: user.createdAt || new Date(),
    };

    await setDoc(userRef, userData, { merge: true });
  }

  async getUserByUid(uid: string): Promise<User | null> {
    const userRef = doc(db, this.USERS_COLLECTION, uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return userSnap.data() as User;
    }

    return null;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const usersRef = collection(db, this.USERS_COLLECTION);
    const q = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return doc.data() as User;
    }

    return null;
  }

  async updateUser(uid: string, updates: Partial<User>): Promise<void> {
    const userRef = doc(db, this.USERS_COLLECTION, uid);
    const updateData = {
      ...updates,
      updatedAt: new Date(),
    };

    await updateDoc(userRef, updateData);
  }

  async deleteUser(uid: string): Promise<void> {
    const userRef = doc(db, this.USERS_COLLECTION, uid);
    await deleteDoc(userRef);
  }
}

export const firestoreService = new FirestoreService();
