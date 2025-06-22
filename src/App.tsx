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
  hobby?: string; // オプション
  other?: string; // オプション
};

export default function App() {
  const [user, setUser] = useState<User | null>(null); // ユーザー情報
  const [contacts, setContacts] = useState<Contact[]>([]); // プロフィールカードのリスト
  const [editModalOpen, setEditModalOpen] = useState(false); // 編集モーダルの開閉状態
  const [editContact, setEditContact] = useState<Contact | null>(null); // 編集対象の連絡先
  // 編集モーダルのフォーム入力欄の状態。文字が入力されるたびに更新
  const [editName, setEditName] = useState("");
  const [editJob, setEditJob] = useState("");
  const [editHobby, setEditHobby] = useState("");
  const [editOther, setEditOther] = useState("");
  const auth = getAuth(); // Firebase Authのインスタンスを取得

  // ユーザーのログイン状態を監視して、ログイン・ログアウトの変化をリアルタイムで反映
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // ログイン中のユーザーの「contacts」コレクションをリアルタイムで取得・表示
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

  // 新規追加
  const addContact = async (data: {
    name: string;
    job: string;
    hobby?: string;
    other?: string;
  }) => {
    // ログインしていなければ処理を中断
    if (!user) return;
    // Firestore にデータを追加
    await addDoc(collection(db, "contacts"), {
      name: data.name,
      job: data.job,
      hobby: data.hobby,
      other: data.other,
      uid: user.uid,
      createdAt: serverTimestamp(),
    });
  };

  // 削除
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
        <h1 className="text-5xl font-bold">メモ帳</h1>
        <div className="flex items-center justify-between mt-4">
          <p>こんにちは、{user.email}</p>
          <button onClick={handleLogout} className="whitespace-nowrap">
            ログアウト
          </button>
        </div>
      </header>

      {/* 入力フォーム */}
      <ProfileCardForm onSubmit={addContact} />

      {/* プロフィールカード一覧 */}
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
