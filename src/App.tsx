import React, { useEffect, useState } from "react";
import { collection, onSnapshot, addDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "./firebase";

type Memo = {
  id: string;
  text: string;
};

export default function MemoApp() {
  const [memos, setMemos] = useState<Memo[]>([]);
  const [input, setInput] = useState("");

  // メモ一覧をリアルタイムで取得
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "memos"), (snapshot) => {
      const memosData = snapshot.docs.map(doc => ({
        id: doc.id,
        text: doc.data().text,
      }));
      setMemos(memosData);
    });
    return () => unsubscribe();
  }, []);

  // メモ追加
  const addMemo = async () => {
    if (input.trim() === "") return;
    await addDoc(collection(db, "memos"), { text: input });
    setInput("");
  };

  // メモ削除
  const deleteMemo = async (id: string) => {
    await deleteDoc(doc(db, "memos", id));
  };

  return (
    <div>
      <h1>メモ帳</h1>
      <input
        type="text"
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="メモを入力"
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
