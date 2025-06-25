"use client";

import { useEffect, useState } from "react";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";

type Feedback = {
  id: number;
  emoji: string;
  message: string;
  user: {
    id: number;
    username: string;
  };
};

const columns = [
  { header: "ID", accessor: "id" },
  { header: "Nom utilisateur", accessor: "user.username" },
  { header: "Message", accessor: "message" },
  { header: "Emoji", accessor: "emoji" },
];

const FeedbacksList = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:8000/feedback/getAll", { // corrigé ici
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
      setFeedbacks(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des feedbacks:", error);
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = feedbacks.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(feedbacks.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const renderRow = (item: Feedback) => {
    return (
      <tr key={item.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-[#EBF2F6]">
        <td className="p-4">{item.id}</td>
        <td className="p-4">{item.user.username}</td>
        <td className="p-4">{item.message}</td>
        <td className="p-4">{item.emoji}</td>
      </tr>
    );
  };

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">Tous les feedbacks</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
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

export default FeedbacksList;