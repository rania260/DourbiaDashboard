import Image from "next/image";

type DestinationDetailsProps = {
  destination: {
    id: number;
    nom: string;
    description: string;
    image: string;
    adresse?: string;
    code_postal?: string;
    ville?: string;
    telephone?: string;
    email?: string;
    site_web?: string;
  };
  onClose: () => void;
};

const ViewDestinationModal = ({ destination, onClose }: DestinationDetailsProps) => {
  return (
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header avec bouton fermer */}
        <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">Détails de la destination</h1>
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
          {/* Section Image + Infos principales */}
          <div className="flex flex-col items-center gap-6 pb-6 mb-6 border-b w-full">
            <div className="w-full max-w-md h-48 rounded-lg overflow-hidden border border-gray-200">
              <Image
                src={destination.image.startsWith("http") ? destination.image : `/images/${destination.image}`}
                alt={destination.nom}
                width={400}
                height={200}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800">{destination.nom}</h2>
              <p className="text-gray-600 mt-2">{destination.description}</p>
            </div>
          </div>

          {/* Grille d'informations */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 w-full">
            <div className="flex justify-center">
              <InfoCard label="ID Destination" value={destination.id.toString()} />
            </div>
            <div className="flex justify-center">
              <InfoCard label="Nom" value={destination.nom} />
            </div>
            <div className="flex justify-center">
              <InfoCard label="Adresse" value={destination.adresse || "Non renseignée"} />
            </div>
            <div className="flex justify-center">
              <InfoCard label="Code Postal" value={destination.code_postal || "Non renseigné"} />
            </div>
            <div className="flex justify-center">
              <InfoCard label="Ville" value={destination.ville || "Non renseignée"} />
            </div>
            <div className="flex justify-center">
              <InfoCard label="Téléphone" value={destination.telephone || "Non renseigné"} />
            </div>
            <div className="flex justify-center">
              <InfoCard label="Email" value={destination.email || "Non renseigné"} />
            </div>
            <div className="flex justify-center">
              <InfoCard
                label="Site Web"
                value={destination.site_web ? destination.site_web.replace(/^https?:\/\//, '') : "Non renseigné"}
                isLink={!!destination.site_web}
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

const InfoCard = ({
  label,
  value,
  className = "",
  isLink = false,
}: {
  label: string;
  value: string;
  className?: string;
  isLink?: boolean;
}) => (
  <div className="bg-gray-50 p-4 rounded-lg w-full max-w-xs">
    <h3 className="text-sm font-medium text-gray-500">{label}</h3>
    {isLink ? (
      <a
        href={`https://${value}`}
        target="_blank"
        rel="noopener noreferrer"
        className={`mt-1 text-lg font-semibold text-blue-600 hover:underline ${className}`}
      >
        {value}
      </a>
    ) : (
      <p className={`mt-1 text-lg font-semibold ${className}`}>
        {value || <span className="text-gray-400">Non renseigné</span>}
      </p>
    )}
  </div>
);

export default ViewDestinationModal;
