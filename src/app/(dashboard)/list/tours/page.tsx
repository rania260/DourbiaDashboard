"use client";

import { useEffect, useState } from "react";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import Image from "next/image";
import CircuitModal from "@/components/Modal/CircuitModal";
import ViewCircuitModal from "@/components/ViewDetails/ViewCircuitModal";

type Circuit = {
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

const columns = [
  { header: "Informations", accessor: "info" },
  { header: "Description", accessor: "description" },
  { header: "Étapes", accessor: "etapes" },
  { header: "Distance (km)", accessor: "distance" },
  { header: "Durée", accessor: "duree" },
  { header: "Point de départ", accessor: "depart" },
  { header: "Actions", accessor: "action" },
];

const CircuitsList = () => {
  const [circuits, setCircuits] = useState<Circuit[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCircuit, setSelectedCircuit] = useState<Circuit | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchCircuits = async () => {
    try {
      const response = await fetch("http://localhost:8000/circuit/getAll", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        const sortedData = [...data].sort((a, b) => a.id - b.id);
        setCircuits(sortedData);
      } else {
        console.error("Failed to fetch circuits");
      }
    } catch (error) {
      console.error("Error fetching circuits:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCircuits();
  }, []);

  const indexOfLastCircuit = currentPage * itemsPerPage;
  const indexOfFirstCircuit = indexOfLastCircuit - itemsPerPage;
  const currentCircuits = circuits.slice(indexOfFirstCircuit, indexOfLastCircuit);
  const totalPages = Math.ceil(circuits.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const formatDuration = (heures: number, minutes: number) => {
    return `${heures}h${minutes.toString().padStart(2, '0')}`;
  };

  const renderRow = (item: Circuit, index: number) => {
    const kilometrageNum = parseFloat(item.kilometrage as string);
    const lat = parseFloat(item.depart_latitude_circuit as string);
    const lon = parseFloat(item.depart_longitude_circuit as string);

    return (
      <tr key={item.id ?? `row-${index}`} className="border-b border-gray-200 even:bg-slate-50 hover:bg-[#EBF2F6] text-sm">
        <td className="flex items-center gap-4 p-4">
          <div className="relative w-12 h-12 rounded-md overflow-hidden">
            <Image
              src={item.img && item.img.trim() !== "" ? `/images/${item.img}` : "/placeholder.jpg"}
              alt={item.nom_circuit}
              fill
              className="object-cover"
            />

          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">{item.nom_circuit}</h3>
          </div>
        </td>

        <td className="p-4">
          {item.description_thematique
            ? item.description_thematique.split(" ").slice(0, 5).join(" ") + (item.description_thematique.split(" ").length > 5 ? "..." : "")
            : "-"
          }
        </td>

        <td className="p-4">{item.nbr_etape}</td>

        <td className="p-4">
          {isNaN(kilometrageNum) ? "-" : `${kilometrageNum.toFixed(1)} km`}
        </td>

        <td className="p-4">{formatDuration(item.duree_heures, item.duree_minutes)}</td>

        <td className="p-4">
          {isNaN(lat) || isNaN(lon) ? "-" : `${lat.toFixed(4)}, ${lon.toFixed(4)}`}
        </td>

        <td className="p-4">
          <div className="flex items-center justify-end gap-2">
            <button
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              onClick={() => setSelectedCircuit(item)}
            >
              <Image src="/view.png" alt="Voir" width={16} height={16} />
            </button>
            <CircuitModal type="edit" id={item.id} data={item} onSuccess={fetchCircuits} />
            <CircuitModal type="delete" id={item.id} onSuccess={fetchCircuits} />
          </div>
        </td>
      </tr>
    );
  };

  return (
    <>
      <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
        <div className="flex items-center justify-between">
          <h1 className="hidden md:block text-lg font-semibold">Tous les circuits</h1>
          <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
            <TableSearch />
            <div className="flex items-center gap-4 self-end">
              <CircuitModal type="create" onSuccess={fetchCircuits} />
            </div>
          </div>
        </div>

        {loading ? (
          <div>Chargement...</div>
        ) : (
          <Table columns={columns} renderRow={renderRow} data={currentCircuits} />
        )}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>

      {selectedCircuit && (
        <ViewCircuitModal
          circuit={selectedCircuit}
          onClose={() => setSelectedCircuit(null)}
        />
      )}
    </>
  );
};

export default CircuitsList;
