import { getAuth, signInAnonymously, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { app } from './firebase';
import { createOrUpdateUserDoc } from './firestore';

const auth = getAuth(app);

export const loginWithEmail = (email, password) =>
  signInWithEmailAndPassword(auth, email, password);

export const loginAnonymously = async () => {
  const { user } = await signInAnonymously(auth);
  await createOrUpdateUserDoc(user.uid, {
    isGuest: true,
    createdAt: Date.now(),
  });
  return user;
};

export const logout = () => signOut(auth);
export const onAuthChange = (callback) => onAuthStateChanged(auth, callback);

export { auth };
