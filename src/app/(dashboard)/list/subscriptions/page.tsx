"use client";
import { useEffect, useState } from "react";
import FormModal from "@/components/Modal/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";

type Abonnement = {
  id: number;
  nom: string;
  prix: number;
  duree: string; // par exemple "3 mois", "1 an", etc.
};

const columns = [
  { header: "Nom", accessor: "nom" },
  { header: "Prix", accessor: "prix" },
  { header: "Durée", accessor: "duree" },
  { header: "Actions", accessor: "action" },
];

const AbonnementsList = () => {
  const [abonnements, setAbonnements] = useState<Abonnement[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchAbonnements = async () => {
    try {
      const response = await fetch('http://localhost:8000/abonnements/getAll', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        const sortedData = [...data].sort((a, b) => a.id - b.id);
        setAbonnements(sortedData);
      } else {
        console.error('Failed to fetch abonnements');
      }
    } catch (error) {
      console.error('Error fetching abonnements:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAbonnements();
  }, []);

  const indexOfLastAbonnement = currentPage * itemsPerPage;
  const indexOfFirstAbonnement = indexOfLastAbonnement - itemsPerPage;
  const currentAbonnements = abonnements.slice(indexOfFirstAbonnement, indexOfLastAbonnement);
  const totalPages = Math.ceil(abonnements.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const renderRow = (item: Abonnement) => {
    return (
      <tr key={item.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-[#EBF2F6]">
        <td className="p-4">{item.nom}</td>
        <td className="p-4">{item.prix} €</td>
        <td className="p-4">{item.duree}</td>
        <td className="p-4">
          <div className="flex items-center gap-2">
            <FormModal table="subscription" type="edit" id={item.id} data={item} onSuccess={fetchAbonnements} />
            <FormModal table="subscription" type="delete" id={item.id} onSuccess={fetchAbonnements} />
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
          <h1 className="hidden md:block text-lg font-semibold">Tous les abonnements</h1>
          <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
            <TableSearch />
            <div className="flex items-center gap-4 self-end">
              <FormModal table="subscription" type="create" onSuccess={fetchAbonnements} />
            </div>
          </div>
        </div>

        {/* LIST */}
        {loading ? (
          <div>Chargement...</div>
        ) : (
          <Table columns={columns} renderRow={renderRow} data={currentAbonnements} />
        )}

        {/* PAGINATION */}
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </>
  );
};

export default AbonnementsList;
