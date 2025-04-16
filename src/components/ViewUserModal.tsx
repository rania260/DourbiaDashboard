// import Image from "next/image";

// type UserDetailsProps = {
//   user: {
//     id: number;
//     username: string;
//     email: string;
//     avatar: string;
//     role: string;
//     phone: string;
//     region: string;
//     country: string;
//     emailVerifiedAt?: string;
//     isBanned: boolean;
//   };
//   onClose: () => void;
// };

// const ViewUserModal = ({ user, onClose }: UserDetailsProps) => {
//   return (
//     <div className="fixed inset-0 backdrop-blur-md z-50 flex items-center justify-center">
//       <div className="bg-white p-4 rounded-md relative w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%]">
//         <div className="absolute top-4 right-4 cursor-pointer" onClick={onClose}>
//           <Image src="/close.png" alt="" width={14} height={14} />
//         </div>

//         <div className="flex flex-col gap-8 p-4">
//           <h1 className="text-xl font-semibold">Détails de l'utilisateur</h1>

//           {/* Avatar et informations principales */}
//           <div className="flex items-center gap-4 border-b pb-4">
//             <div className="w-20 h-20 rounded-full overflow-hidden">
//               <Image
//                 src={user.avatar || "/default-avatar.png"}
//                 alt={user.username}
//                 width={80}
//                 height={80}
//                 className="w-full h-full object-cover"
//               />
//             </div>
//             <div>
//               <h2 className="text-lg font-semibold">{user.username}</h2>
//               <p className="text-gray-500">{user.email}</p>
//             </div>
//           </div>

//           {/* Informations détaillées */}
//           <div className="grid grid-cols-2 gap-y-6">
//             <InfoItem label="ID Utilisateur" value={user.id.toString()} />
//             <InfoItem 
//               label="Statut" 
//               value={user.isBanned ? "Banni" : "Actif"} 
//               className={user.isBanned ? "text-red-600" : "text-green-600"}
//             />
//             <InfoItem label="Rôle" value={user.role} />
//             <InfoItem label="Téléphone" value={user.phone} />
//             <InfoItem label="Pays" value={user.country} />
//             <InfoItem label="Région" value={user.region} />
//             <InfoItem 
//               label="Email vérifié" 
//               value={user.emailVerifiedAt 
//                 ? new Date(user.emailVerifiedAt).toLocaleDateString("fr-FR")
//                 : "Non vérifié"
//               }
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const InfoItem = ({ label, value, className = "" }: { label: string; value: string; className?: string }) => (
//   <div className="flex items-center gap-2">
//     <span className="text-gray-600 font-medium">{label}:</span>
//     <span className={className}>{value}</span>
//   </div>
// );

// export default ViewUserModal; 
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
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header avec bouton fermer */}
        <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">Détails de l'utilisateur</h1>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Fermer"
          >
            <Image src="/close.png" alt="" width={20} height={20} />
          </button>
        </div>

        {/* Contenu centré */}
        <div className="p-6 flex flex-col items-center">
          {/* Section Avatar + Infos principales */}
          <div className="flex flex-col items-center gap-6 pb-6 mb-6 border-b w-full">
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200">
              <Image
                src={user.avatar || "/default-avatar.png"}
                alt={user.username}
                width={96}
                height={96}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800">{user.username}</h2>
              <p className="text-gray-600">{user.email}</p>
              <div className={`mt-2 px-3 py-1 rounded-full text-sm font-medium inline-block ${user.isBanned ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                }`}>
                {user.isBanned ? "Compte banni" : "Compte actif"}
              </div>
            </div>
          </div>

          {/* Grille d'informations centrée */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            <div className="flex justify-center">
              <InfoCard label="ID Utilisateur" value={user.id.toString()} />
            </div>
            <div className="flex justify-center">
              <InfoCard label="Rôle" value={user.role} />
            </div>
            <div className="flex justify-center">
              <InfoCard label="Téléphone" value={user.phone || "Non renseigné"} />
            </div>
            <div className="flex justify-center">
              <InfoCard label="Pays" value={user.country || "Non renseigné"} />
            </div>
            <div className="flex justify-center">
              <InfoCard label="Région" value={user.region || "Non renseigné"} />
            </div>
            <div className="flex justify-center">
              <InfoCard
                label="Email vérifié"
                value={
                  user.emailVerifiedAt
                    ? `${new Date(user.emailVerifiedAt).toLocaleDateString("fr-FR")} à ${new Date(user.emailVerifiedAt).toLocaleTimeString("fr-FR")}`
                    : "Non vérifié"
                }
                className={user.emailVerifiedAt ? "text-[#2B641E]" : "text-[#E70013] "}
              />

            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white p-4 border-t flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

const InfoCard = ({ label, value, className = "" }: { label: string; value: string; className?: string }) => (
  <div className="bg-gray-50 p-4 rounded-lg w-full max-w-xs">
    <h3 className="text-sm font-medium text-gray-500">{label}</h3>
    <p className={`mt-1 text-lg font-semibold ${className}`}>
      {value || <span className="text-gray-400">Non renseigné</span>}
    </p>
  </div>
);

export default ViewUserModal;