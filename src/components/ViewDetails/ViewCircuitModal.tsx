// "use client";

// import Image from "next/image";

// type ViewCircuitModalProps = {
//   circuit: {
//     id: number;
//     nom_circuit: string;
//     description_thematique: string;
//     nbr_etape: number;
//     kilometrage: number | string;
//     duree_heures: number;
//     duree_minutes: number;
//     depart_longitude_circuit: number | string;
//     depart_latitude_circuit: number | string;
//     img: string;
//     video?: string;
//     created_at: string;
//     updated_at: string;
//   };
//   onClose: () => void;
// };

// const ViewCircuitModal = ({ circuit, onClose }: ViewCircuitModalProps) => {
//   const formatDuration = () => {
//     return `${circuit.duree_heures}h${circuit.duree_minutes.toString().padStart(2, "0")}`;
//   };

//   // Conversion sécurisée en nombre
//   const kilometrageNum = Number(circuit.kilometrage);
//   const latNum = Number(circuit.depart_latitude_circuit);
//   const lonNum = Number(circuit.depart_longitude_circuit);

//   return (
//     <div className="fixed inset-0 backdrop-blur-md z-50 flex items-center justify-center">
//       <div className="bg-white p-6 rounded-md relative w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%] max-h-[90vh] overflow-y-auto">
//         <div className="flex justify-between items-start mb-6">
//           <h2 className="text-xl font-semibold">{circuit.nom_circuit}</h2>
//           <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
//             <Image src="/close.png" alt="Fermer" width={16} height={16} />
//           </button>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div className="space-y-4">
//             <div>
//               <h3 className="text-sm font-medium text-gray-500">Image</h3>
//               <div className="relative w-full h-48 mt-1 rounded-md overflow-hidden">
//                 <Image
//                   src={circuit.img.startsWith("http") ? circuit.img : `/images/${circuit.img}`}
//                   alt={circuit.nom_circuit}
//                   fill
//                   className="object-cover"
//                 />
//               </div>
//             </div>

//             {circuit.video && (
//               <div>
//                 <h3 className="text-sm font-medium text-gray-500">Vidéo</h3>
//                 <div className="mt-1 aspect-video bg-gray-100 rounded-md flex items-center justify-center">
//                   <a
//                     href={circuit.video}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="text-blue-600 hover:underline"
//                   >
//                     Lien vers la vidéo
//                   </a>
//                 </div>
//               </div>
//             )}
//           </div>

//           <div className="space-y-4">
//             <div>
//               <h3 className="text-sm font-medium text-gray-500">Description</h3>
//               <p className="mt-1 text-sm text-gray-900 whitespace-pre-line">{circuit.description_thematique}</p>
//             </div>

//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <h3 className="text-sm font-medium text-gray-500">Nombre d'étapes</h3>
//                 <p className="mt-1 text-sm text-gray-900">{circuit.nbr_etape}</p>
//               </div>
//               <div>
//                 <h3 className="text-sm font-medium text-gray-500">Distance</h3>
//                 <p className="mt-1 text-sm text-gray-900">
//                   {isNaN(kilometrageNum) ? "-" : `${kilometrageNum.toFixed(1)} km`}
//                 </p>
//               </div>
//               <div>
//                 <h3 className="text-sm font-medium text-gray-500">Durée</h3>
//                 <p className="mt-1 text-sm text-gray-900">{formatDuration()}</p>
//               </div>
//               <div>
//                 <h3 className="text-sm font-medium text-gray-500">Point de départ</h3>
//                 <p className="mt-1 text-sm text-gray-900">
//                   {isNaN(latNum) || isNaN(lonNum) ? "-" : `${latNum.toFixed(6)}, ${lonNum.toFixed(6)}`}
//                 </p>
//               </div>
//             </div>

//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <h3 className="text-sm font-medium text-gray-500">Créé le</h3>
//                 <p className="mt-1 text-sm text-gray-900">{new Date(circuit.created_at).toLocaleDateString()}</p>
//               </div>
//               <div>
//                 <h3 className="text-sm font-medium text-gray-500">Mis à jour le</h3>
//                 <p className="mt-1 text-sm text-gray-900">{new Date(circuit.updated_at).toLocaleDateString()}</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ViewCircuitModal;
"use client";

import Image from "next/image";

type ViewCircuitModalProps = {
  circuit: {
    id: number;
    nom_circuit: string;
    description_thematique: string;
    nbr_etape: number;
    kilometrage: number | string;
    duree_heures: number;
    duree_minutes: number;
    depart_longitude_circuit: number | string;
    depart_latitude_circuit: number | string;
    img: string;
    video?: string;
    created_at: string;
    updated_at: string;
  };
  onClose: () => void;
};

const ViewCircuitModal = ({ circuit, onClose }: ViewCircuitModalProps) => {
  const formatDuration = () => {
    return `${circuit.duree_heures}h et ${circuit.duree_minutes
      .toString()
      .padStart(2, "0")}min`;
  };

  const kilometrageNum = Number(circuit.kilometrage);
  const latNum = Number(circuit.depart_latitude_circuit);
  const lonNum = Number(circuit.depart_longitude_circuit);

  return (
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">
            Détails du circuit
          </h1>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Fermer"
          >
            <Image src="/close.png" alt="Fermer" width={20} height={20} />
          </button>
        </div>

        {/* Contenu */}
        <div className="p-6 flex flex-col items-center">
          <div className="flex flex-col items-center gap-6 pb-6 mb-6 border-b w-full">
            {/* Image */}
            <div className="w-full max-w-md h-48 rounded-lg overflow-hidden border border-gray-200">
              <Image
                src={
                  circuit.img.startsWith("http")
                    ? circuit.img
                    : `/images/${circuit.img}`
                }
                alt={circuit.nom_circuit}
                width={400}
                height={200}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Vidéo */}
            {circuit.video && (
              <div className="text-center">
                <h3 className="text-sm font-medium text-gray-500">Vidéo</h3>
                <a
                  href={circuit.video}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Lien vers la vidéo
                </a>
              </div>
            )}

            {/* Nom et Description */}
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800">
                {circuit.nom_circuit}
              </h2>
              <p className="text-gray-600 mt-2 whitespace-pre-line">
                {circuit.description_thematique}
              </p>
            </div>
          </div>

          {/* Infos en grille */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 w-full">
            <InfoCard label="ID Circuit" value={circuit.id.toString()} />
            <InfoCard label="Nombre d'étapes" value={circuit.nbr_etape.toString()} />
            <InfoCard
              label="Kilométrage"
              value={isNaN(kilometrageNum) ? "Non renseigné" : `${kilometrageNum.toFixed(1)} km`}
            />
            <InfoCard label="Durée" value={formatDuration()} />
            <InfoCard
              label="Latitude"
              value={isNaN(latNum) ? "Non renseignée" : `${latNum.toFixed(6)}`}
            />
            <InfoCard
              label="Longitude"
              value={isNaN(lonNum) ? "Non renseignée" : `${lonNum.toFixed(6)}`}
            />
            <InfoCard
              label="Créé le"
              value={new Date(circuit.created_at).toLocaleDateString()}
            />
            <InfoCard
              label="Mis à jour le"
              value={new Date(circuit.updated_at).toLocaleDateString()}
            />
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
}: {
  label: string;
  value: string;
}) => (
  <div className="bg-gray-50 p-4 rounded-lg w-full max-w-xs mx-auto">
    <h3 className="text-sm font-medium text-gray-500">{label}</h3>
    <p className="mt-1 text-lg font-semibold text-gray-800">
      {value || <span className="text-gray-400">Non renseigné</span>}
    </p>
  </div>
);

export default ViewCircuitModal;
