// components/ProfileCardList.tsx
type Contact = {
  id: string;
  name: string;
  job: string;
};

type ProfileCardListProps = {
  contacts: Contact[];
  onDelete: (id: string) => void;
  onEdit: (contact: Contact) => void;
};

export default function ProfileCardList({
  contacts,
  onDelete,
  onEdit,
}: ProfileCardListProps) {
  return (
    <div>
      {contacts.map((contact) => (
        <div key={contact.id} className="p-6 bg-white rounded-lg shadow-md">
          <div className="flex items-start justify-between">
            <p className="font-semibold tracking-tight text-lg">
              {contact.name}
            </p>
            <button onClick={() => onEdit(contact)}>編集</button>
            <button onClick={() => onDelete(contact.id)}>削除</button>
          </div>
          <p>職業：{contact.job}</p>
        </div>
      ))}
    </div>
  );
}
