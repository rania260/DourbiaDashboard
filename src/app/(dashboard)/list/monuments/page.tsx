"use client";
import { useEffect, useState } from "react";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import Image from "next/image";
import MonumentDetails from "@/components/ViewDetails/ViewMonumentModal";
import MonumentModal from "@/components/Modal/MonumentModal";

type Monument = {
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

const columns = [
  { header: "Nom", accessor: "nom_monument_FR" },
  { header: "Priorité", accessor: "priorité" },
  { header: "Statut", accessor: "statut_monument" },
  { header: "Importance", accessor: "importance_monument" },
  { header: "Accessibilité", accessor: "accessibilite_monument" },
  { header: "État conservation", accessor: "etat_conservation" },
  { header: "Actions", accessor: "action" },
];

const MonumentsList = () => {
  const [monuments, setMonuments] = useState<Monument[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMonument, setSelectedMonument] = useState<Monument | null>(null);
  const itemsPerPage = 5;

  const fetchMonuments = async () => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const response = await fetch("http://localhost:8000/monument/getAll", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        },
      });
      if (response.ok) {
        const data = await response.json();
        const sortedData = [...data].sort((a, b) => a.id - b.id);
        setMonuments(sortedData);
      } else {
        console.error("Erreur lors de la récupération des monuments");
      }
    } catch (err) {
      console.error("Erreur réseau :", err);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchMonuments();
  }, []);

  const indexOfLastMonument = currentPage * itemsPerPage;
  const indexOfFirstMonument = indexOfLastMonument - itemsPerPage;
  const currentMonuments = monuments.slice(indexOfFirstMonument, indexOfLastMonument);
  const totalPages = Math.ceil(monuments.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const renderRow = (item: Monument) => {
    return (
      <tr
        key={item.id}
        className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-[#EBF2F6]"
      >
        <td className="p-4">{item.nom_monument_FR}</td>
        <td className="p-4">{item.priorité}</td>
        <td className="p-4">{item.statut_monument}</td>
        <td className="p-4">{item.importance_monument}</td>
        <td className="p-4">{item.accessibilite_monument}</td>
        <td className="p-4">{item.etat_conservation}</td>
        <td className="p-4">
          <div className="flex items-center gap-2">
            {/* Bouton View */}
            <button
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              onClick={() => setSelectedMonument(item)}
            >
              <Image src="/view.png" alt="Voir" width={16} height={16} />
            </button>

            <MonumentModal
              type="edit"
              id={item.id}
              data={item}
              onSuccess={fetchMonuments}
            />
            <MonumentModal
              type="delete"
              id={item.id}
              onSuccess={fetchMonuments}
            />
          </div>
        </td>
      </tr>
    );
  };

  return (
    <>
      <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0 overflow-x-auto">
        <div className="flex items-center justify-between flex-wrap">
          <h1 className="text-lg font-semibold">Liste des Monuments</h1>
          <div className="flex flex-col md:flex-row items-center gap-4">
            <TableSearch />
            <MonumentModal  type="create" onSuccess={fetchMonuments} />
          </div>
        </div>

        {loading ? (
          <div className="mt-6">Chargement...</div>
        ) : (
          <Table columns={columns} renderRow={renderRow} data={currentMonuments} />
        )}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>

      {/* Modal de visualisation des détails */}
      {selectedMonument && (
        <MonumentDetails
          monument={selectedMonument}
          onClose={() => setSelectedMonument(null)}
        />
      )}
    </>
  );
};

export default MonumentsList;