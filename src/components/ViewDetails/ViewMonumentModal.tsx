"use client";
import Image from "next/image";

type MonumentDetailsProps = {
  monument: {
    id: number;
    nom_monument_FR: string;
    nom_monument_EN: string;
    nom_monument_AR: string;
    priorité?: number;
    latitude_monument?: string;
    longitude_monument?: string;
    statut_monument?: string;
    importance_monument?: string;
    accessibilite_monument?: string;
    relief?: string;
    adresse_monument?: string;
    description_FR?: string;
    description_EN?: string;
    description_AR?: string;
    Affect?: string;
    etat_conservation?: string;
    duree_visite?: number;
    horaire_ouverture_ete?: string;
    horaire_fermeture_ete?: string;
    horaire_ouverture_hiver?: string;
    horaire_fermeture_hiver?: string;
    telephone_site?: string;
    epoque_dominante?: string;
    epoque_moins_visible?: string;
    troisieme_epoque?: string;
    fonction_monument?: string;
    image_panoramique?: string;
    modele_obj?: string;
    url_video_FR?: string;
    uri_video_EN?: string;
    uri_video_AR?: string;
    lien_video_360?: string;
    lien_video_3D?: string;
    enregistrement_audio_FR?: string;
    enregistrement_audio_EN?: string;
    enregistrement_audio_AR?: string;
  };
  onClose: () => void;
};

const ViewMonumentModal = ({ monument, onClose }: MonumentDetailsProps) => {
  return (
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header avec bouton fermer */}
        <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">Détails du Monument</h1>
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
              {monument.image_panoramique ? (
                <Image
                  src={monument.image_panoramique.startsWith("http") ? monument.image_panoramique : `/images/${monument.image_panoramique}`}
                  alt={monument.nom_monument_FR}
                  width={400}
                  height={300}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <span className="text-gray-400">Aucune image</span>
                </div>
              )}
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800">{monument.nom_monument_FR}</h2>
              <p className="text-gray-600 mt-1">{monument.nom_monument_EN}</p>
              <p className="text-gray-600 mt-1 text-right" dir="rtl">
                {monument.nom_monument_AR}
              </p>
            </div>
          </div>

          {/* Grille d'informations */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            <div className="flex justify-center">
              <InfoCard label="ID Monument" value={monument.id.toString()} />
            </div>
            <div className="flex justify-center">
              <InfoCard label="Priorité" value={monument.priorité?.toString() || "Non renseignée"} />
            </div>
            <div className="flex justify-center">
              <InfoCard label="Statut" value={monument.statut_monument || "Non renseigné"} />
            </div>
            <div className="flex justify-center">
              <InfoCard label="Importance" value={monument.importance_monument || "Non renseignée"} />
            </div>
            <div className="flex justify-center">
              <InfoCard label="Adresse" value={monument.adresse_monument || "Non renseignée"} />
            </div>
            <div className="flex justify-center">
              <InfoCard label="Latitude" value={monument.latitude_monument || "Non renseignée"} />
            </div>
            <div className="flex justify-center">
              <InfoCard label="Longitude" value={monument.longitude_monument || "Non renseignée"} />
            </div>
            <div className="flex justify-center">
              <InfoCard label="Accessibilité" value={monument.accessibilite_monument || "Non renseignée"} />
            </div>
            <div className="flex justify-center">
              <InfoCard label="Relief" value={monument.relief || "Non renseigné"} />
            </div>
            <div className="flex justify-center">
              <InfoCard label="Affect" value={monument.Affect || "Non renseigné"} />
            </div>
            <div className="flex justify-center">
              <InfoCard label="Durée visite" value={monument.duree_visite ? `${monument.duree_visite} min` : "Non renseignée"} />
            </div>
            <div className="flex justify-center">
              <InfoCard 
                label="Horaire été (ouverture/fermeture)" 
                value={monument.horaire_ouverture_ete && monument.horaire_fermeture_ete 
                  ? `${monument.horaire_ouverture_ete} - ${monument.horaire_fermeture_ete}` 
                  : "Non renseigné"} 
              />
            </div>
            <div className="flex justify-center">
              <InfoCard 
                label="Horaire hiver (ouverture/fermeture)" 
                value={monument.horaire_ouverture_hiver && monument.horaire_fermeture_hiver 
                  ? `${monument.horaire_ouverture_hiver} - ${monument.horaire_fermeture_hiver}` 
                  : "Non renseigné"} 
              />
            </div>
            <div className="flex justify-center">
              <InfoCard label="Téléphone" value={monument.telephone_site || "Non renseigné"} />
            </div>
            <div className="flex justify-center">
              <InfoCard label="État conservation" value={monument.etat_conservation || "Non renseigné"} />
            </div>
            <div className="flex justify-center">
              <InfoCard label="Époque dominante" value={monument.epoque_dominante || "Non renseignée"} />
            </div>
            <div className="flex justify-center">
              <InfoCard label="Époque moins visible" value={monument.epoque_moins_visible || "Non renseignée"} />
            </div>
            <div className="flex justify-center">
              <InfoCard label="Troisième époque" value={monument.troisieme_epoque || "Non renseignée"} />
            </div>
            <div className="flex justify-center">
              <InfoCard label="Fonction" value={monument.fonction_monument || "Non renseignée"} />
            </div>
            <div className="flex justify-center">
              <InfoCard label="Modèle 3D" value={monument.modele_obj ? "Disponible" : "Non disponible"} />
            </div>
            <div className="flex justify-center">
  <InfoCard 
    label="Vidéo (FR)" 
    value={monument.url_video_FR || "Non renseignée"} 
    isLink={!!monument.url_video_FR}
  />
</div>
<div className="flex justify-center">
  <InfoCard 
    label="Vidéo (EN)" 
    value={monument.uri_video_EN || "Non renseignée"} 
    isLink={!!monument.uri_video_EN}
  />
</div>
<div className="flex justify-center">
  <InfoCard 
    label="Vidéo (AR)" 
    value={monument.uri_video_AR || "Non renseignée"} 
    isLink={!!monument.uri_video_AR}
  />
</div>
<div className="flex justify-center">
  <InfoCard 
    label="Vidéo 360" 
    value={monument.lien_video_360 || "Non renseignée"} 
    isLink={!!monument.lien_video_360}
  />
</div>
<div className="flex justify-center">
  <InfoCard 
    label="Vidéo 3D" 
    value={monument.lien_video_3D || "Non renseignée"} 
    isLink={!!monument.lien_video_3D}
  />
</div>
            <div className="flex justify-center">
              <InfoCard 
                label="Audio (FR)" 
                value={monument.enregistrement_audio_FR ? "Disponible" : "Non disponible"} 
              />
            </div>
            <div className="flex justify-center">
              <InfoCard 
                label="Audio (EN)" 
                value={monument.enregistrement_audio_EN ? "Disponible" : "Non disponible"} 
              />
            </div>
            <div className="flex justify-center">
              <InfoCard 
                label="Audio (AR)" 
                value={monument.enregistrement_audio_AR ? "Disponible" : "Non disponible"} 
              />
            </div>
            <div className="flex justify-center col-span-1 sm:col-span-2 lg:col-span-3">
              <InfoCard 
                label="Description (FR)" 
                value={monument.description_FR || "Non renseignée"} 
                fullWidth 
              />
            </div>
            <div className="flex justify-center col-span-1 sm:col-span-2 lg:col-span-3">
              <InfoCard 
                label="Description (EN)" 
                value={monument.description_EN || "Non renseignée"} 
                fullWidth 
              />
            </div>
            <div className="flex justify-center col-span-1 sm:col-span-2 lg:col-span-3">
              <InfoCard 
                label="Description (AR)" 
                value={monument.description_AR || "Non renseignée"} 
                fullWidth 
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
  fullWidth = false,
}: {
  label: string;
  value: string;
  className?: string;
  isLink?: boolean;
  fullWidth?: boolean;
}) => (
  <div className={`bg-gray-50 p-4 rounded-lg ${fullWidth ? "w-full" : "w-full max-w-xs"} ${className}`}>
    <h3 className="text-sm font-medium text-gray-500">{label}</h3>
    {isLink ? (
      <a
        href={value.startsWith('http') ? value : `https://${value}`}
        target="_blank"
        rel="noopener noreferrer"
        className={`mt-1 text-lg font-semibold text-blue-600 hover:underline break-all ${className}`}
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

export default ViewMonumentModal;