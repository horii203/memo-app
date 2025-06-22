import React from "react";

type Props = {
  open: boolean; // モーダルの開閉状態
  name: string;
  job: string;
  hobby?: string;
  other?: string;
  onNameChange: (value: string) => void; // 名前が変更されたときに呼ばれる関数
  onJobChange: (value: string) => void;
  onHobbyChange: (value: string) => void;
  onOtherChange?: (value: string) => void;
  onSave: () => void; // 保存ボタンが押されたときに呼ばれる関数
  onClose: () => void; // モーダルを閉じるときに呼ばれる関数
};

export default function EditModal({
  open,
  name,
  job,
  hobby,
  other,
  onNameChange,
  onJobChange,
  onHobbyChange,
  onOtherChange,
  onSave,
  onClose,
}: Props) {
  // falseの場合は何も表示しない
  if (!open) return null;

  // モーダル用のスタイル
  const backdropStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    background: "rgba(0,0,0,0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  };

  const modalStyle: React.CSSProperties = {
    background: "#fff",
    borderRadius: "8px",
    padding: "32px 24px",
    minWidth: "320px",
    boxShadow: "0 2px 16px rgba(0,0,0,0.2)",
    zIndex: 1001,
  };

  return (
    <div style={backdropStyle}>
      <div style={modalStyle}>
        <h2>編集</h2>
        <input
          type="text"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="名前"
          className="border p-2 mb-2 w-full"
        />
        <input
          type="text"
          value={job}
          onChange={(e) => onJobChange(e.target.value)}
          placeholder="職業"
          className="border p-2 mb-2 w-full"
        />
        <input
          type="text"
          value={hobby}
          onChange={(e) => onHobbyChange(e.target.value)}
          placeholder="趣味"
          className="border p-2 mb-2 w-full"
        />
        <input
          type="text"
          value={other}
          onChange={(e) => onOtherChange?.(e.target.value)}
          placeholder="その他"
          className="border p-2 mb-2 w-full"
        />
        <div className="flex gap-2 mt-4">
          <button onClick={onSave} className="bg-blue-500 px-4 py-2 rounded">
            保存
          </button>
          <button onClick={onClose} className="bg-gray-300 px-4 py-2 rounded">
            キャンセル
          </button>
        </div>
      </div>
    </div>
  );
}
