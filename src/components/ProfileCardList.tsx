// components/ProfileCardList.tsx
type Contact = {
  id: string;
  name: string;
  job: string;
};

type ProfileCardListProps = {
  contacts: Contact[];
  onDelete: (id: string) => void;
};

export default function ProfileCardList({ contacts, onDelete }: ProfileCardListProps) {
  return (
    <div className="space-y-4">
      {contacts.map((contact) => (
        <div
          key={contact.id}
          className="border border-gray-300 rounded-md p-4 max-w-md mx-auto shadow-sm"
        >
          <p><strong>名前:</strong> {contact.name}</p>
          <p><strong>職業:</strong> {contact.job}</p>
          <button
            onClick={() => onDelete(contact.id)}
            className="mt-2 text-sm hover:underline"
          >
            削除
          </button>
        </div>
      ))}
    </div>
  );
}
