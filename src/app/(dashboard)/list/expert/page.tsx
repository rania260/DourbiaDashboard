"use client";
import { useEffect, useState } from "react";
import ExpertModal from "@/components/Modal/ExpertModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import Image from "next/image";
import ViewExpertModal from "@/components/ViewDetails/ViewExpertModal";

type ExpertUser = {
  id: number;
  username: string;
  email: string;
  avatar: string;
  role: string;
  phone: string;
  region: string;
  country: string;
  emailVerifiedAt?: string;
  isBanned: boolean;
  uniqueId?: string;
  specialities: string[];
  description: string;
  epochs: string[];
};

const ExpertsList = () => {
  const [experts, setExperts] = useState<(ExpertUser & { uniqueId: string })[]>([]);
  const [filteredExperts, setFilteredExperts] = useState<(ExpertUser & { uniqueId: string })[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedExpert, setSelectedExpert] = useState<ExpertUser | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const columns = [
    {
      header: "Information",
      accessor: "info",
    },
    {
      header: "ID", 
      accessor: "userId",
      className: "hidden md:table-cell",
    },
    {
      header: "Spécialités", 
      accessor: "specialities",
      className: "hidden md:table-cell",
    },
    {
      header: "Description", 
      accessor: "description",
      className: "hidden lg:table-cell",
    },
    {
      header: "Époques", 
      accessor: "epochs",
      className: "hidden lg:table-cell",
    },
    {
      header: "Téléphone", 
      accessor: "phone",
      className: "hidden md:table-cell",
    },
    {
      header: "Pays", 
      accessor: "country",
      className: "hidden md:table-cell",
    },
    {
      header: "Région", 
      accessor: "region",
      className: "hidden md:table-cell",
    },
    {
      header: "Vérification", 
      accessor: "verification",
    },
    {
      header: "Statut", 
      accessor: "status",
    },
    {
      header: "Actions", 
      accessor: "action",
    },
  ];

  const fetchExperts = async () => {
    try {
      const response = await fetch('http://localhost:8000/experts/getAll', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Experts data:', data);
        
        if (Array.isArray(data)) {
          const expertsWithUniqueIds = data.map((expert: ExpertUser, index: number) => ({
            ...expert,
            uniqueId: expert.id ? expert.id.toString() : `temp-${index}-${Date.now()}`
          }));
          setExperts(expertsWithUniqueIds);
          setFilteredExperts(expertsWithUniqueIds);
        }
      } else {
        console.error('Failed to fetch experts');
      }
    } catch (error) {
      console.error('Error fetching experts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperts();
  }, []);

  const indexOfLastExpert = currentPage * itemsPerPage;
  const indexOfFirstExpert = indexOfLastExpert - itemsPerPage;
  const currentExperts = filteredExperts.slice(indexOfFirstExpert, indexOfLastExpert);
  const totalPages = Math.ceil(filteredExperts.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const renderRow = (item: ExpertUser & { uniqueId: string }) => {
    const verification = item.emailVerifiedAt ? "Oui" : "Non";

    const rowClassName = item.isBanned 
      ? "border-b border-gray-200 even:bg-slate-50 text-sm text-[#8F8F8F]" 
      : "border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-[#EBF2F6]";

    return (
      <tr key={item.uniqueId} className={rowClassName}>
        <td className="flex items-center gap-4 p-4">
          <Image
            src={item.avatar || "/default-avatar.png"}
            alt=""
            width={40}
            height={40}
            className="md:hidden xl:block w-10 h-10 rounded-full object-cover"
          />
          <div className="flex flex-col">
            <h3 className="font-semibold">{item.username}</h3>
            <p className="text-xs text-gray-500">{item.email}</p>
          </div>
        </td>
        <td className="hidden md:table-cell">{item.id || 'N/A'}</td>
        <td className="hidden md:table-cell">
          {item.specialities?.join(', ') || 'N/A'}
        </td>
        <td className="hidden lg:table-cell">
          {item.description || 'N/A'}
        </td>
        <td className="hidden lg:table-cell">
          {item.epochs?.join(', ') || 'N/A'}
        </td>
        <td className="hidden md:table-cell">{item.phone || 'N/A'}</td>
        <td className="hidden md:table-cell">{item.country || 'N/A'}</td>
        <td className="hidden md:table-cell">{item.region || 'N/A'}</td>
        <td>{verification}</td>
        <td>
          <span className={`px-2 py-1 rounded-full text-xs ${
            item.isBanned 
              ? "bg-red-100 text-red-800" 
              : "bg-green-100 text-green-800"
          }`}>
            {item.isBanned ? "Banni" : "Actif"}
          </span>
        </td>
        <td>
          <div className="flex items-center gap-2">
            <button 
              className="w-7 h-7 flex items-center justify-center rounded-full"
              onClick={() => setSelectedExpert(item)}
            >
              <Image src="/view.png" alt="" width={16} height={16} />
            </button>
            <ExpertModal 
              table="experts" 
              type="edit" 
              id={item.id} 
              data={item} 
              onSuccess={fetchExperts} 
            />
            <ExpertModal table="experts" type="ban" id={item.id} isBanned={item.isBanned} onSuccess={fetchExperts} />
            <ExpertModal table="experts" type="delete" id={item.id} onSuccess={fetchExperts} />
          </div>
        </td>
      </tr>
    );
  };

  return (
    <>
      <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
        <div className="flex items-center justify-between">
          <h1 className="hidden md:block text-lg font-semibold">Gestion des experts</h1>
          <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
            <TableSearch />
            <div className="flex items-center gap-4 self-end">
              <ExpertModal table="experts" type="create" onSuccess={fetchExperts} />
            </div>
          </div>
        </div>
        {loading ? (
          <div>Chargement...</div>
        ) : (
          <Table columns={columns} renderRow={renderRow} data={currentExperts} />
        )}
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
      
      {selectedExpert && (
        <ViewExpertModal 
          expert={selectedExpert} 
          onClose={() => setSelectedExpert(null)} 
        />
      )}
    </>
  );
};

export default ExpertsList;