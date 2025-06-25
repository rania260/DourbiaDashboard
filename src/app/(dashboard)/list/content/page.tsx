"use client";

import { useEffect, useState } from "react";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import FormModal from "@/components/Modal/FormModal";

type Contribution = {
  id: number;
  text?: string;
  fileUrl?: string;
  fileType?: "image" | "video" | "pdf" | string;
  monument: {
    id: number;
    nom_monument_FR: string;
  };
  user: {
    id: number;
    username: string;
  };
  createdAt: string;
};

const columns = [
  { header: "Monument", accessor: "monument" },
  { header: "Texte", accessor: "text", className: "hidden md:table-cell" },
  { header: "Fichier", accessor: "file", className: "hidden md:table-cell" },
  { header: "Utilisateur", accessor: "user" },
  { header: "Date", accessor: "createdAt", className: "hidden lg:table-cell" },
  { header: "Actions", accessor: "action" },
];

const ContributionsList = () => {
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchContributions = async () => {
    try {
      const res = await fetch("http://localhost:8000/contributions/getAll", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setContributions(data);
      } else {
        console.error("Erreur lors du chargement des contributions");
      }
    } catch (err) {
      console.error("Erreur:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContributions();
  }, []);

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = contributions.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(contributions.length / itemsPerPage);

  const handlePageChange = (page: number) => setCurrentPage(page);

  const renderRow = (item: Contribution) => {
    const filePreview = () => {
      const baseUrl = "http://localhost:8000/uploads/contributions/";
      if (!item.fileUrl) return "—";
      const url = baseUrl + item.fileUrl;

      switch (item.fileType) {
        case "image":
          return <img src={url} alt="img" className="h-10 w-auto rounded" />;
        case "video":
          return <video src={url} className="h-10" controls />;
        case "pdf":
          return (
            <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
              Voir PDF
            </a>
          );
        default:
          return <a href={url}>Télécharger</a>;
      }
    };

    return (
      <tr key={item.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-[#EBF2F6]">
        <td className="p-4">{item.monument?.nom_monument_FR || "—"}</td>
        <td className="hidden md:table-cell p-4">{item.text || "—"}</td>
        <td className="hidden md:table-cell p-4">{filePreview()}</td>
        <td className="p-4">{item.user?.username || "—"}</td>
        <td className="hidden lg:table-cell p-4">
          {new Date(item.createdAt).toLocaleDateString()}
        </td>
        <td className="p-4">
          <div className="flex items-center gap-2">
            <FormModal table="content" type="edit" id={item.id} data={item} onSuccess={fetchContributions} />
            <FormModal table="content" type="delete" id={item.id} onSuccess={fetchContributions} />
          </div>
        </td>
      </tr>
    );
  };

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Contributions des utilisateurs</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <FormModal table="content" type="create" onSuccess={fetchContributions} />
        </div>
      </div>

      {loading ? (
        <div>Chargement...</div>
      ) : (
        <Table columns={columns} renderRow={renderRow} data={currentItems} />
      )}

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
    </div>
  );
};

export default ContributionsList;
