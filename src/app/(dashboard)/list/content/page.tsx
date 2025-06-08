"use client";
import { useEffect, useState } from "react";
import FormModal from "@/components/Modal/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";

type Contenu = {
  id: number;
  type: string;
  description: string;
  monument_id: number; // Id du monument auquel ce contenu appartient
};

const columns = [
  { header: "Type", accessor: "type" },
  { header: "Description", accessor: "description", className: "hidden md:table-cell" },
  { header: "Monument ID", accessor: "monument_id" },
  { header: "Actions", accessor: "action" },
];

const ContenusList = () => {
  const [contenus, setContenus] = useState<Contenu[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchContenus = async () => {
    try {
      const response = await fetch('http://localhost:8000/contenus/getAll', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        const sortedData = [...data].sort((a, b) => a.id - b.id);
        setContenus(sortedData);
      } else {
        console.error('Failed to fetch contenus');
      }
    } catch (error) {
      console.error('Error fetching contenus:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContenus();
  }, []);

  const indexOfLastContenu = currentPage * itemsPerPage;
  const indexOfFirstContenu = indexOfLastContenu - itemsPerPage;
  const currentContenus = contenus.slice(indexOfFirstContenu, indexOfLastContenu);
  const totalPages = Math.ceil(contenus.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const renderRow = (item: Contenu) => {
    return (
      <tr key={item.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-[#EBF2F6]">
        <td className="p-4">{item.type}</td>
        <td className="hidden md:table-cell p-4">{item.description}</td>
        <td className="p-4">{item.monument_id}</td>
        <td className="p-4">
          <div className="flex items-center gap-2">
            <FormModal table="content" type="edit" id={item.id} data={item} onSuccess={fetchContenus} />
            <FormModal table="content" type="delete" id={item.id} onSuccess={fetchContenus} />
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
          <h1 className="hidden md:block text-lg font-semibold">Tous les contenus</h1>
          <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
            <TableSearch />
            <div className="flex items-center gap-4 self-end">
              <FormModal table="content" type="create" onSuccess={fetchContenus} />
            </div>
          </div>
        </div>

        {/* LIST */}
        {loading ? (
          <div>Chargement...</div>
        ) : (
          <Table columns={columns} renderRow={renderRow} data={currentContenus} />
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

export default ContenusList;
