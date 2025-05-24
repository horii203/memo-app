import { useEffect, useState } from "react";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import type { User } from "firebase/auth";
import { collection, onSnapshot, addDoc, deleteDoc, doc, query, where } from "firebase/firestore";
import { db } from "./firebase";
import AuthForm from "./components/AuthForm";

type Memo = {
  id: string;
  text: string;
};

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [memos, setMemos] = useState<Memo[]>([]);
  const [input, setInput] = useState("");
  const auth = getAuth();

  // 認証状態監視
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, currentUser => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // ログイン成功時に呼ぶコールバック
  const onLoginSuccess = () => {
    // 認証状態はonAuthStateChangedで監視しているので特に処理不要ですが、
    // 必要に応じてここで追加処理も可能です
  };

  // メモ一覧をユーザーごとにリアルタイム取得
  useEffect(() => {
    if (!user) {
      setMemos([]);
      return;
    }

    const q = query(collection(db, "memos"), where("uid", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const memosData = snapshot.docs.map(doc => ({
        id: doc.id,
        text: doc.data().text,
      }));
      setMemos(memosData);
    });

    return () => unsubscribe();
  }, [user]);

  const addMemo = async () => {
    if (!user) {
      alert("ログインしてください");
      return;
    }
    if (input.trim() === "") return;

    await addDoc(collection(db, "memos"), {
      text: input,
      uid: user.uid,
    });
    setInput("");
  };

  const deleteMemo = async (id: string) => {
    await deleteDoc(doc(db, "memos", id));
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  if (!user) {
    return <AuthForm onLoginSuccess={onLoginSuccess} />;
  }

  return (
    <div>
      <h1>メモ帳</h1>
      <p>こんにちは、{user.email}</p>
      <button onClick={handleLogout}>ログアウト</button>

      <input
        type="text"
        placeholder="メモを入力"
        value={input}
        onChange={e => setInput(e.target.value)}
      />
      <button onClick={addMemo}>追加</button>

      <ul>
        {memos.map(memo => (
          <li key={memo.id}>
            {memo.text} <button onClick={() => deleteMemo(memo.id)}>削除</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
