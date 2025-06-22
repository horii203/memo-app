// components/ProfileCardForm.tsx
import { useState } from "react";

type ProfileCardFormProps = {
  onSubmit: (data: {
    name: string;
    job: string;
    hobby: string;
    other: string;
  }) => void;
};

export default function ProfileCardForm({ onSubmit }: ProfileCardFormProps) {
  const [name, setName] = useState("");
  const [job, setjob] = useState("");
  const [hobby, setHobby] = useState("");
  const [other, setOther] = useState("");

  // フォームの送信処理
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 「名前」と「職業」が空の場合は送信しない
    if (name.trim() === "" || job.trim() === "") return;
    // 入力されたデータを親コンポーネントに送信
    onSubmit({ name, job, hobby, other });
    // 送信後にフォームの状態を初期化して空にする
    setName("");
    setjob("");
    setHobby("");
    setOther("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md"
    >
      <h2 className="text-2xl font-semibold mb-4">プロフィール登録</h2>

      <label className="block mb-2 text-gray-700 font-medium" htmlFor="name">
        名前
      </label>
      <input
        id="name"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="例: 山田太郎"
        className="w-full px-3 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <label className="block mb-2 text-gray-700 font-medium" htmlFor="job ">
        職業
      </label>
      <input
        id="job "
        type="text"
        value={job}
        onChange={(e) => setjob(e.target.value)}
        placeholder="例: エンジニア"
        className="w-full px-3 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <label className="block mb-2 text-gray-700 font-medium" htmlFor="hobby">
        趣味
      </label>
      <input
        id="hobby"
        type="text"
        value={hobby}
        onChange={(e) => setHobby(e.target.value)}
        placeholder="例: ギター"
        className="w-full px-3 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <label className="block mb-2 text-gray-700 font-medium" htmlFor="other">
        その他
      </label>
      <textarea
        id="other"
        value={other}
        onChange={(e) => setOther(e.target.value)}
        placeholder=""
        className="w-full px-3 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        rows={3}
      />

      <button type="submit" className="w-full">
        追加
      </button>
    </form>
  );
}
