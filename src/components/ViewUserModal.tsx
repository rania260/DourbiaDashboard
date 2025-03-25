import Image from "next/image";

type UserDetailsProps = {
  user: {
    id: number;
    username: string;
    email: string;
    avatar: string;
    role: string;
    phone: string;
    region: string;
    country: string;
    emailVerifiedAt?: string;
    isBanned: boolean;
  };
  onClose: () => void;
};

const ViewUserModal = ({ user, onClose }: UserDetailsProps) => {
  return (
    <div className="fixed inset-0 backdrop-blur-md z-50 flex items-center justify-center">
      <div className="bg-white p-4 rounded-md relative w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%]">
        <div className="absolute top-4 right-4 cursor-pointer" onClick={onClose}>
          <Image src="/close.png" alt="" width={14} height={14} />
        </div>

        <div className="flex flex-col gap-8 p-4">
          <h1 className="text-xl font-semibold">Détails de l'utilisateur</h1>

          {/* Avatar et informations principales */}
          <div className="flex items-center gap-4 border-b pb-4">
            <div className="w-20 h-20 rounded-full overflow-hidden">
              <Image
                src={user.avatar || "/default-avatar.png"}
                alt={user.username}
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-lg font-semibold">{user.username}</h2>
              <p className="text-gray-500">{user.email}</p>
            </div>
          </div>

          {/* Informations détaillées */}
          <div className="grid grid-cols-2 gap-y-6">
            <InfoItem label="ID Utilisateur" value={user.id.toString()} />
            <InfoItem 
              label="Statut" 
              value={user.isBanned ? "Banni" : "Actif"} 
              className={user.isBanned ? "text-red-600" : "text-green-600"}
            />
            <InfoItem label="Rôle" value={user.role} />
            <InfoItem label="Téléphone" value={user.phone} />
            <InfoItem label="Pays" value={user.country} />
            <InfoItem label="Région" value={user.region} />
            <InfoItem 
              label="Email vérifié" 
              value={user.emailVerifiedAt 
                ? new Date(user.emailVerifiedAt).toLocaleDateString("fr-FR")
                : "Non vérifié"
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoItem = ({ label, value, className = "" }: { label: string; value: string; className?: string }) => (
  <div className="flex items-center gap-2">
    <span className="text-gray-600 font-medium">{label}:</span>
    <span className={className}>{value}</span>
  </div>
);

export default ViewUserModal; 