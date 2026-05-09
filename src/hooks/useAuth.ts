import { useState, useEffect } from 'react';
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { UserProfile, Store } from '../types';
import { useStore } from './useStore';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { setStore } = useStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const docRef = doc(db, 'users', firebaseUser.uid);
        const userDoc = await getDoc(docRef);
        
        let userProfile: UserProfile | null = null;

        if (userDoc.exists()) {
          userProfile = userDoc.data() as UserProfile;
          
          if (firebaseUser.email === 'muhammedhmad111@gmail.com' && userProfile.role !== 'admin') {
            userProfile.role = 'admin';
            try {
              await updateDoc(docRef, { role: 'admin' });
            } catch (e) {
              console.error("Failed to update admin role in DB:", e);
            }
          }
        } else {
          const isAdminEmail = firebaseUser.email === 'muhammedhmad111@gmail.com';
          userProfile = {
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName || '',
            photoURL: firebaseUser.photoURL || '',
            role: isAdminEmail ? 'admin' : 'user',
            createdAt: new Date().toISOString()
          };
          await setDoc(docRef, userProfile);
        }

        if (userProfile?.currentStoreId) {
          const storeDoc = await getDoc(doc(db, 'stores', userProfile.currentStoreId));
          if (storeDoc.exists()) {
            setStore({ id: storeDoc.id, ...storeDoc.data() } as Store);
          }
        } else if (firebaseUser.uid) {
          const storesRef = collection(db, 'stores');
          const q = query(storesRef, where("ownerId", "==", firebaseUser.uid));
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            const firstStore = querySnapshot.docs[0];
            const storeData = { id: firstStore.id, ...firstStore.data() } as Store;
            setStore(storeData);
            if (userProfile) {
              userProfile.currentStoreId = storeData.id;
              await updateDoc(docRef, { currentStoreId: storeData.id });
            }
          }
        }
        
        setProfile(userProfile);
      } else {
        setProfile(null);
        // Don't aggressively clear store on logout to allow storefront to persist
        // setStore(null); 
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [setStore]);

  return { user, profile, loading, isAdmin: profile?.role === 'admin' };
}
