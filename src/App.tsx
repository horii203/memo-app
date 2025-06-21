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
  serverTimestamp,
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
  hobby?: string;
  other?: string;
};

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editContact, setEditContact] = useState<Contact | null>(null);
  const [editName, setEditName] = useState("");
  const [editJob, setEditJob] = useState("");
  const [editHobby, setEditHobby] = useState("");
  const [editOther, setEditOther] = useState("");
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
        hobby: doc.data().hobby || "",
        other: doc.data().other || "",
      }));
      setContacts(contactData);
    });

    return () => unsubscribe();
  }, [user]);

  const addContact = async (data: {
    name: string;
    profession: string;
    hobby?: string;
    other?: string;
  }) => {
    if (!user) return;
    await addDoc(collection(db, "contacts"), {
      name: data.name,
      job: data.profession,
      hobby: data.hobby,
      other: data.other,
      uid: user.uid,
      createdAt: serverTimestamp(),
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
    setEditHobby(contact.hobby || "");
    setEditOther(contact.other || "");
    setEditModalOpen(true);
  };

  // 編集保存
  const handleEditSave = async () => {
    if (!editContact) return;
    await updateDoc(doc(db, "contacts", editContact.id), {
      name: editName,
      job: editJob,
      hobby: editHobby,
      other: editOther,
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
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <header>
        <h1 className="text-5xl font-bold">メモ</h1>
        <div className="flex items-center justify-between mt-4">
          <p>こんにちは、{user.email}</p>
          <button onClick={handleLogout} className="whitespace-nowrap">
            ログアウト
          </button>
        </div>
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
        hobby={editHobby}
        other={editOther}
        onNameChange={setEditName}
        onJobChange={setEditJob}
        onHobbyChange={setEditHobby}
        onOtherChange={setEditOther}
        onSave={handleEditSave}
        onClose={() => setEditModalOpen(false)}
      />
    </div>
  );
}
