// components/ProfileCardList.tsx
type Contact = {
  id: string;
  name: string;
  job: string;
  hobby?: string;
  other?: string;
};

type ProfileCardListProps = {
  contacts: Contact[]; // プロフィールカードのリスト
  onDelete: (id: string) => void; // 削除ボタンが押されたときのコールバック
  onEdit: (contact: Contact) => void; // 編集ボタンが押されたときのコールバック
};

export default function ProfileCardList({
  contacts,
  onDelete,
  onEdit,
}: ProfileCardListProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {contacts.map((contact) => (
        <div key={contact.id} className="p-6 bg-white rounded-lg shadow-md">
          <div className="flex items-start justify-between">
            <p className="font-semibold tracking-tight text-lg">
              {contact.name}
            </p>
            <div className="flex space-x-2">
              <button onClick={() => onEdit(contact)}>編集</button>
              <button onClick={() => onDelete(contact.id)}>削除</button>
            </div>
          </div>
          <div className="text-gray-600">職業：{contact.job}</div>
          {contact.hobby && (
            <div className="text-gray-600">趣味: {contact.hobby}</div>
          )}
          {contact.other && (
            <div className="text-gray-600">その他: {contact.other}</div>
          )}
        </div>
      ))}
    </div>
  );
}
