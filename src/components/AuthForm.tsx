import { useState } from "react";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

type AuthFormProps = {
  onLoginSuccess: () => void; // ログイン成功後にAppに通知するコールバック
};

export default function AuthForm({ onLoginSuccess }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const auth = getAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isRegister) {
        await createUserWithEmailAndPassword(auth, email, password);
        alert("登録成功しました！");
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        alert("ログイン成功しました！");
      }
      onLoginSuccess();
    } catch (error) {
      alert("エラー：" + (error as Error).message);
    }
  };

  return (
    <div>
      <h2>{isRegister ? "新規登録" : "ログイン"}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="メールアドレス"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="パスワード"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit">{isRegister ? "登録" : "ログイン"}</button>
      </form>
      <button onClick={() => setIsRegister(!isRegister)}>
        {isRegister ? "ログイン画面に戻る" : "新規登録はこちら"}
      </button>
    </div>
  );
}
