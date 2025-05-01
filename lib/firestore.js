import { getFirestore, doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { app } from "./firebase";

const db = getFirestore(app);

export const createOrUpdateUserDoc = async (uid, data) => {
  const ref = doc(db, "users", uid);
  const snapshot = await getDoc(ref);
  const baseData = {
    ...data,
    lastLogin: serverTimestamp(),
  };

  if (!snapshot.exists()) {
    await setDoc(ref, baseData);
  } else {
    await setDoc(ref, baseData, { merge: true });
  }
};

export { db };
