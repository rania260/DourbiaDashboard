"use client";

import { useEffect, useState } from "react";
import FormModal from "@/components/Modal/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import Image from "next/image";
import ViewDestinationModal from "@/components/ViewDetails/ViewDestinationModal";
import DestinationModal from "@/components/Modal/DestinationModal";

type Destination = {
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

const columns = [
  { header: "Informations", accessor: "info" },
  { header: "Description", accessor: "description" },
  { header: "Code Postal", accessor: "code_postal" },
  { header: "Téléphone", accessor: "telephone" },
  { header: "Email", accessor: "email" },
  { header: "Site Web", accessor: "site_web" },
  { header: "Actions", accessor: "action" },
];

const DestinationsList = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchDestinations = async () => {
    try {
      const response = await fetch("http://localhost:8000/destination/getAll", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        const sortedData = [...data].sort((a, b) => a.id - b.id);
        setDestinations(sortedData);
      } else {
        console.error("Failed to fetch destinations");
      }
    } catch (error) {
      console.error("Error fetching destinations:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDestinations();
  }, []);

  const indexOfLastDestination = currentPage * itemsPerPage;
  const indexOfFirstDestination = indexOfLastDestination - itemsPerPage;
  const currentDestinations = destinations.slice(indexOfFirstDestination, indexOfLastDestination);
  const totalPages = Math.ceil(destinations.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const renderRow = (item: Destination) => {
    return (
      <tr key={item.id} className="border-b border-gray-200 even:bg-slate-50 hover:bg-[#EBF2F6] text-sm">
        {/* Informations */}
        <td className="flex items-center gap-4 p-4">
          <div className="relative w-12 h-12 rounded-md overflow-hidden">
            <Image
              src={item.image.startsWith("http") ? item.image : `/images/${item.image}`}
              alt={item.nom}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">{item.nom}</h3>
            <p className="text-xs text-gray-500 truncate">
              {[item.adresse, item.ville].filter(Boolean).join(", ") || "Aucune adresse"}
            </p>
          </div>
        </td>

        {/* Description */}
        <td className="p-4">
          {item.description
            ? item.description.split(" ").slice(0, 3).join(" ") + (item.description.split(" ").length > 3 ? "..." : "")
            : "-"
          }
        </td>


        {/* Adresse
        <td className="p-4">{item.adresse || "-"}</td> */}

        {/* Code Postal */}
        <td className="p-4">{item.code_postal || "-"}</td>

        {/* Ville */}
        {/* <td className="p-4">{item.ville || "-"}</td> */}

        {/* Téléphone */}
        <td className="p-4">{item.telephone || "-"}</td>

        {/* Email */}
        <td className="p-4">{item.email || "-"}</td>

        {/* Site Web */}
        <td className="p-4">
          {item.site_web ? (
            <a
              href={item.site_web.startsWith("http") ? item.site_web : `https://${item.site_web}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline text-xs"
            >
              {item.site_web}
            </a>
          ) : (
            "-"
          )}
        </td>

        {/* Actions */}
        <td className="p-4">
          <div className="flex items-center justify-end gap-2">
            <button
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              onClick={() => setSelectedDestination(item)}
            >
              <Image src="/view.png" alt="Voir" width={16} height={16} />
            </button>
            <DestinationModal type="edit" id={item.id} data={item} onSuccess={fetchDestinations} />
            <DestinationModal type="delete" id={item.id} onSuccess={fetchDestinations} />
          </div>
        </td>
      </tr>
    );
  };

  return (
    <>
      <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
        {/* TOP */}
        <div className="flex items-center justify-between">
          <h1 className="hidden md:block text-lg font-semibold">Toutes les destinations</h1>
          <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
            <TableSearch />
            <div className="flex items-center gap-4 self-end">
            <DestinationModal type="create" onSuccess={fetchDestinations} />
            </div>
          </div>
        </div>

        {/* LIST */}
        {loading ? (
          <div>Chargement...</div>
        ) : (
          <Table columns={columns} renderRow={renderRow} data={currentDestinations} />
        )}

        {/* PAGINATION */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>

      {/* Modal de visualisation */}
      {selectedDestination && (
        <ViewDestinationModal
          destination={selectedDestination}
          onClose={() => setSelectedDestination(null)}
        />
      )}
    </>
  );
};

export default DestinationsList;
