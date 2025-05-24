// components/ProfileCardForm.tsx
import { useState } from "react";

type ProfileCardFormProps = {
  onSubmit: (data: { name: string; profession: string }) => void;
};

export default function ProfileCardForm({ onSubmit }: ProfileCardFormProps) {
  const [name, setName] = useState("");
  const [profession, setProfession] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() === "" || profession.trim() === "") return;
    onSubmit({ name, profession });
    setName("");
    setProfession("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md"
    >
      <h2 className="text-2xl font-semibold mb-4 text-center">プロフィール登録</h2>

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

      <label className="block mb-2 text-gray-700 font-medium" htmlFor="profession">
        職業
      </label>
      <input
        id="profession"
        type="text"
        value={profession}
        onChange={(e) => setProfession(e.target.value)}
        placeholder="例: エンジニア"
        className="w-full px-3 py-2 mb-6 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <button
        type="submit"
        className="w-full bg-blue-600 font-semibold py-2 rounded-md hover:bg-blue-700 transition"
      >
        追加
      </button>
    </form>
  );
}
