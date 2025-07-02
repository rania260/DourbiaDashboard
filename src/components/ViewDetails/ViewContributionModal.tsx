"use client";

import Image from "next/image";
import { useState } from "react";
import axios from "axios";

type Contribution = {
  id: number;
  text?: string;
  fileUrl?: string;
  fileType?: "image" | "video" | "pdf" | string;
  monument: { id: number; nom_monument_FR: string };
  user: { id: number; username: string };
  createdAt: string;
  status?: 'pending' | 'accepted' | 'rejected';
  decisionComment?: string;
  decidedById?: number;
  decidedAt?: string;
};

type Props = {
  contribution: Contribution;
  onClose: () => void;
};

const ViewContributionModal = ({ contribution, onClose }: Props) => {
  const [decisionComment, setDecisionComment] = useState("");
  const [showDecisionForm, setShowDecisionForm] = useState(false);

  const handleDecision = async (status: 'accepted' | 'rejected') => {
    try {
        await axios.post(
            `http://localhost:8000/contributions/${contribution.id}/decision`,
            {
              status,
              comment: status === 'rejected' ? decisionComment : ""
            },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
              }
            }
          );          
      onClose();
    } catch (error) {
      console.error('Erreur lors de la prise de décision:', error);
    }
  };

  const fileUrl = contribution.fileUrl
    ? `http://localhost:8000/uploads/contributions/${contribution.fileUrl}`
    : null;

  const renderFilePreview = () => {
    if (!fileUrl) return <p className="text-gray-500">Aucun fichier</p>;

    switch (contribution.fileType) {
      case "image":
        return <img src={fileUrl} alt="image" className="w-full rounded-lg" />;
      case "video":
        return <video src={fileUrl} controls className="w-full rounded-lg" />;
      case "pdf":
        return (
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
            Voir PDF
          </a>
        );
      default:
        return (
          <a href={fileUrl} download className="text-blue-500 underline">
            Télécharger le fichier
          </a>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">Détails de la contribution</h1>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100"
            aria-label="Fermer"
          >
            <Image src="/close.png" alt="Fermer" width={20} height={20} />
          </button>
        </div>

        {/* Contenu */}
        <div className="p-6 flex flex-col items-center gap-6">
          {/* Fichier média */}
          <div className="w-full max-w-lg h-64 rounded-lg overflow-hidden border border-gray-200">
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              {renderFilePreview()}
            </div>
          </div>

          {/* Infos principales */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800">{contribution.monument.nom_monument_FR}</h2>
            <p className="text-gray-600">Par: {contribution.user.username}</p>
            <p className="text-sm text-gray-500 mt-1">
              {new Date(contribution.createdAt).toLocaleString("fr-FR")}
            </p>
          </div>

          {/* Grille des détails */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
            <InfoCard label="ID de la contribution" value={contribution.id.toString()} />
            <InfoCard label="Type de fichier" value={contribution.fileType || "—"} />
            {contribution.status && (
              <InfoCard 
                label="Statut" 
                value={contribution.status.charAt(0).toUpperCase() + contribution.status.slice(1)} 
              />
            )}
            {contribution.decisionComment && (
              <InfoCard 
                label="Commentaire" 
                value={contribution.decisionComment} 
              />
            )}
            {contribution.decidedById && contribution.decidedAt && (
              <InfoCard 
                label="Décision prise par" 
                value={`${contribution.decidedById} (${new Date(contribution.decidedAt).toLocaleString('fr-FR')})`} 
              />
            )}
          </div>

          {/* Texte de la contribution */}
          <div className="w-full">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Texte de la contribution</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700">{contribution.text || "—"}</p>
            </div>
          </div>

          {/* Form de décision */}
          {contribution.status === 'pending' && (
            <div className="w-full">
              <button
                onClick={() => setShowDecisionForm(!showDecisionForm)}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 mb-4"
              >
                {showDecisionForm ? 'Annuler' : 'Prendre une décision'}
              </button>

              {showDecisionForm && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex gap-4 mb-4">
                    <button
                      onClick={() => handleDecision('accepted')}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                      Accepter
                    </button>
                    <button
                      onClick={() => setShowDecisionForm(false)}
                      className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500"
                    >
                      Annuler
                    </button>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Commentaire (obligatoire pour le rejet)
                    </label>
                    <textarea
                      value={decisionComment}
                      onChange={(e) => setDecisionComment(e.target.value)}
                      className="w-full p-2 border rounded-md"
                      placeholder="Expliquez pourquoi vous rejetez cette contribution..."
                      rows={4}
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={() => handleDecision('rejected')}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                      Rejeter
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white p-4 border-t flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
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
  <div className="bg-gray-50 p-4 rounded-lg w-full">
    <h3 className="text-sm font-medium text-gray-500">{label}</h3>
    <p className="mt-1 text-lg font-semibold text-gray-800">{value}</p>
  </div>
);

export default ViewContributionModal;
