"use client";
import { useEffect, useState } from "react";
import PartnerModal from "@/components/Modal/PartnerModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import Image from "next/image";
import ViewPartenaireModal from "@/components/ViewDetails/ViewPartenaireModal";

type User = {
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
  types: string[];
  description: string;
  regions: string[];
  services: string[];
};

const PartenairesList = () => {
  const [users, setUsers] = useState<(User & { uniqueId: string })[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<(User & { uniqueId: string })[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Nouvel ordre des colonnes comme demandé
  const columns = [
    {
      header: "Information",
      accessor: "info",
    },
    {
      header: "ID Utilisateur", 
      accessor: "userId",
      className: "hidden md:table-cell",
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
      header: "Services", 
      accessor: "services",
      className: "hidden lg:table-cell",
    },
    {
      header: "Types", 
      accessor: "types",
      className: "hidden lg:table-cell",
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

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:8000/partners/getAll', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        
        if (Array.isArray(data)) {
          const usersWithUniqueIds = data.map((user: User, index: number) => ({
            ...user,
            uniqueId: user.id ? user.id.toString() : `temp-${index}-${Date.now()}`
          }));
          setUsers(usersWithUniqueIds);
          setFilteredUsers(usersWithUniqueIds);
        }
      }
    } catch (error) {
      console.error('Error fetching partners:', error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchUsers();
  }, []);

  const indexOfLastUser = currentPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const renderRow = (item: User & { uniqueId: string }) => {
    const verification = item.emailVerifiedAt ? "Oui" : "Non";
  
    const rowClassName = item.isBanned 
      ? "border-b border-gray-200 even:bg-slate-50 text-sm text-[#8F8F8F]" 
      : "border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-[#EBF2F6]";
  
    return (
      <tr key={item.uniqueId} className={rowClassName}>
        {/* Colonne Information */}
        <td className="flex items-center gap-4 p-4">
          <Image
            src={item.avatar || "/default-avatar.png"}
            alt=""
            width={40}
            height={40}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="flex flex-col">
            <h3 className="font-semibold">{item.username}</h3>
            <p className="text-xs text-gray-500">{item?.email}</p>
          </div>
        </td>
        
        {/* Colonne ID */}
        <td className="hidden md:table-cell p-4">{item.id || 'N/A'}</td>
        
        {/* Colonnes Téléphone, Pays, Région */}
        <td className="hidden md:table-cell p-4">{item.phone || 'N/A'}</td>
        <td className="hidden md:table-cell p-4">{item.country || 'N/A'}</td>
        <td className="hidden md:table-cell p-4">{item.region || 'N/A'}</td>
        
        {/* Colonnes Services et Types */}
        <td className="hidden lg:table-cell p-4">
          {item.services && item.services.length > 0 ? item.services.join(', ') : 'N/A'}
        </td>
        <td className="hidden lg:table-cell p-4">
          {item.types && item.types.length > 0 ? item.types.join(', ') : 'N/A'}
        </td>
        
        {/* Colonnes Vérification et Statut */}
        <td className="p-4">{verification}</td>
        <td className="p-4">
          <span className={`px-2 py-1 rounded-full text-xs ${
            item.isBanned 
              ? "bg-red-100 text-red-800" 
              : "bg-green-100 text-green-800"
          }`}>
            {item.isBanned ? "Banni" : "Actif"}
          </span>
        </td>
        
        {/* Colonne Actions */}
        <td className="p-4">
          <div className="flex items-center gap-2">
            <button 
              className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100"
              onClick={() => setSelectedUser(item)}
              title="Voir détails"
            >
              <Image src="/view.png" alt="Voir" width={16} height={16} />
            </button>
            <PartnerModal 
              table="partners" 
              type="edit" 
              id={item.id} 
              data={item} 
              onSuccess={fetchUsers} 
            />
            <PartnerModal table="partners" type="ban" id={item.id} isBanned={item.isBanned} onSuccess={fetchUsers} />
            <PartnerModal table="partners" type="delete" id={item.id} onSuccess={fetchUsers} />
          </div>
        </td>
      </tr>
    );
  };

  return (
    <>
      <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
        <div className="flex items-center justify-between">
          <h1 className="hidden md:block text-lg font-semibold">Gestion des partenaires</h1>
          <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
            <TableSearch />
            <div className="flex items-center gap-4 self-end">
              <PartnerModal table="partners" type="create" onSuccess={fetchUsers} />
            </div>
          </div>
        </div>
        {loading ? (
          <div>Chargement...</div>
        ) : (
          <Table columns={columns} renderRow={renderRow} data={currentUsers} />
        )}
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
      
      {/* Modal pour afficher description et régions */}
      {selectedUser && (
        <ViewPartenaireModal 
          partenaire={selectedUser} 
          onClose={() => setSelectedUser(null)} 
        />
      )}
    </>
  );
};

export default PartenairesList;