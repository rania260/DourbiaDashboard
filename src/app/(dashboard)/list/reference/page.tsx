"use client";

import { useEffect, useState } from "react";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import ReferenceModal from "@/components/Modal/ReferenceModal";

type Reference = {
  id: number;
  nom: string;
  logo: string;
};

const columns = [
  { header: "Nom", accessor: "nom" },
  { header: "Logo", accessor: "logo" },
  { header: "Actions", accessor: "action" },
];

const ReferencesList = () => {
  const [references, setReferences] = useState<Reference[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchReferences = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:8000/reference/getAll", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP! statut: ${response.status}`);
      }

      const data = await response.json();
      const sortedData = [...data].sort((a, b) => a.id - b.id);
      setReferences(sortedData);
    } catch (error) {
      console.error("Erreur lors de la récupération des références:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReferences();
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = references.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(references.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const renderRow = (item: Reference) => {
    return (
      <tr key={item.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-[#EBF2F6]">
        <td className="p-4">{item.nom}</td>
        <td className="p-4">
          {item.logo && (
            <img 
              src={`http://localhost:8000${item.logo}`}
              alt={item.nom}
              className="h-10 w-auto rounded-md"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
                console.error('Erreur de chargement de l\'image:', item.logo);
              }}
            />
          )}
        </td>
        <td className="p-4">
          <div className="flex items-center gap-2">
            <ReferenceModal type="edit" id={item.id} data={item} onSuccess={fetchReferences} />
            <ReferenceModal type="delete" id={item.id} onSuccess={fetchReferences} />
          </div>
        </td>
      </tr>
    );
  };

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">Toutes les références</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <ReferenceModal type="create" onSuccess={fetchReferences} />
          </div>
        </div>
      </div>

      {loading ? (
        <div>Chargement...</div>
      ) : (
        <>
          <Table columns={columns} renderRow={renderRow} data={currentItems} />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
};

export default ReferencesList;