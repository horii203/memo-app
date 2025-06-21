import { useEffect, useState } from "react";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import type { User } from "firebase/auth";
import "./App.css";
import {
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import { db } from "./firebase";
import AuthForm from "./components/AuthForm";
import ProfileCardForm from "./components/ProfileCardForm";
import ProfileCardList from "./components/ProfileCardList";

type Contact = {
  id: string;
  name: string;
  job: string;
};

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) {
      setContacts([]);
      return;
    }

    const q = query(collection(db, "contacts"), where("uid", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const contactData = snapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
        job: doc.data().job,
      }));
      setContacts(contactData);
    });

    return () => unsubscribe();
  }, [user]);

  const addContact = async (data: { name: string; profession: string }) => {
    if (!user) return;
    await addDoc(collection(db, "contacts"), {
      name: data.name,
      job: data.profession,
      uid: user.uid,
    });
  };
  const deleteContact = async (id: string) => {
    await deleteDoc(doc(db, "contacts", id));
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  if (!user) {
    return <AuthForm onLoginSuccess={() => {}} />;
  }

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">メモ</h1>
        <p>こんにちは、{user.email}</p>
        <button onClick={handleLogout}>ログアウト</button>
      </header>

      <ProfileCardForm onSubmit={addContact} />
      <ProfileCardList contacts={contacts} onDelete={deleteContact} />
    </div>
  );
}
