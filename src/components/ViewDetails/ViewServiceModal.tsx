import Image from "next/image";

type ServiceDetailsProps = {
  service: {
    id: string;
    service: string;
    type: string;
    description: string;
    regions: string[];
    prix: number;
    partner: {
      username: string;
      avatar: string;
    };
  };
  onClose: () => void;
};

const ViewServiceModal = ({ service, onClose }: ServiceDetailsProps) => {
  return (
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header avec bouton fermer */}
        <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">Détails du service</h1>
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
          {/* Section Partenaire */}
          <div className="flex flex-col items-center gap-4 pb-6 mb-6 border-b w-full">
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200">
              <Image
                src={service.partner.avatar || "/default-avatar.png"}
                alt={service.partner.username}
                width={96}
                height={96}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800">{service.partner.username}</h2>
            </div>
          </div>

          {/* Grille d'informations centrée */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            <div className="flex justify-center">
              <InfoCard label="ID Service" value={service.id} />
            </div>
            <div className="flex justify-center">
              <InfoCard label="Nom du service" value={service.service} />
            </div>
            <div className="flex justify-center">
              <InfoCard label="Type" value={service.type} />
            </div>
            <div className="flex justify-center">
              <InfoCard label="Prix" value={`${service.prix} DH`} className="text-[#2B641E]" />
            </div>
            <div className="flex justify-center">
              <InfoCard 
                label="Description" 
                value={service.description || "Non renseignée"} 
                className="text-gray-600"
              />
            </div>
            <div className="flex justify-center">
              <InfoCard 
                label="Régions" 
                value={service.regions.join(', ')} 
                className="text-gray-600"
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

export default ViewServiceModal;
