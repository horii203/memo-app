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
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import AuthForm from "./components/AuthForm";
import ProfileCardForm from "./components/ProfileCardForm";
import ProfileCardList from "./components/ProfileCardList";
import EditModal from "./components/EditModal";

type Contact = {
  id: string;
  name: string;
  job: string;
};

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editContact, setEditContact] = useState<Contact | null>(null);
  const [editName, setEditName] = useState("");
  const [editJob, setEditJob] = useState("");
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

  // 編集開始
  const handleEditClick = (contact: Contact) => {
    setEditContact(contact);
    setEditName(contact.name);
    setEditJob(contact.job);
    setEditModalOpen(true);
  };

  // 編集保存
  const handleEditSave = async () => {
    if (!editContact) return;
    await updateDoc(doc(db, "contacts", editContact.id), {
      name: editName,
      job: editJob,
    });
    setEditModalOpen(false);
    setEditContact(null);
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
      <ProfileCardList
        contacts={contacts}
        onDelete={deleteContact}
        onEdit={handleEditClick}
      />

      {/* 編集モーダル */}
      <EditModal
        open={editModalOpen}
        name={editName}
        job={editJob}
        onNameChange={setEditName}
        onJobChange={setEditJob}
        onSave={handleEditSave}
        onClose={() => setEditModalOpen(false)}
      />
    </div>
  );
}
