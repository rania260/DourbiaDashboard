"use client";
import { useEffect, useState } from "react";
import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import Image from "next/image";
import ViewUserModal from "@/components/ViewUserModal";

type User = {
  id: number;
  username: string;
  email?: string;
  avatar: string;
  role: string;
  phone: string;
  region: string;
  country: string;
  emailVerifiedAt?: string;
  isBanned: boolean;
};

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
    header: "Rôle", 
    accessor: "role",
    className: "hidden md:table-cell",
  },
  {
    header: "Téléphone", 
    accessor: "phone",
    className: "hidden lg:table-cell",
  },
  {
    header: "Pays", 
    accessor: "country",
    className: "hidden lg:table-cell",
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

const UsersList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:8000/auth/getAll', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,  
        },
      });
      if (response.ok) {
        const data = await response.json();
        const sortedData = [...data].sort((a, b) => a.id - b.id);
        setUsers(sortedData);
      } else {
        console.error('Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const indexOfLastUser = currentPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const renderRow = (item: User) => {
    const verification = item.emailVerifiedAt
      ? `Oui, ${new Date(item.emailVerifiedAt).toLocaleDateString("fr-FR")}`
      : "Non";

    const rowClassName = item.isBanned 
      ? "border-b border-gray-200 even:bg-slate-50 text-sm text-[#8F8F8F]" 
      : "border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-orange-200";

    return (
      <tr key={item.id} className={rowClassName}>
        <td className="flex items-center gap-4 p-4">
          <Image
            src={item.avatar}
            alt=""
            width={40}
            height={40}
            className="md:hidden xl:block w-10 h-10 rounded-full object-cover"
          />
          <div className="flex flex-col">
            <h3 className="font-semibold">{item.username}</h3>
            <p className="text-xs text-gray-500">{item?.email}</p>
          </div>
        </td>
        <td className="hidden md:table-cell">{item.id}</td>
        <td className="hidden md:table-cell">{item.role}</td>
        <td className="hidden md:table-cell">{item.phone}</td>
        <td className="hidden md:table-cell">{item.country}</td>
        <td className="hidden md:table-cell">{item.region}</td>
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
              onClick={() => setSelectedUser(item)}
            >
              <Image src="/view.png" alt="" width={16} height={16} />
            </button>
            <FormModal 
              table="users" 
              type="edit" 
              id={item.id} 
              data={item} 
              onSuccess={fetchUsers} 
            />
            <FormModal table="users" type="ban" id={item.id} isBanned={item.isBanned} onSuccess={fetchUsers} />
            <FormModal table="users" type="delete" id={item.id} onSuccess={fetchUsers} />
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
          <h1 className="hidden md:block text-lg font-semibold">Tous les utilisateurs</h1>
          <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
            <TableSearch />
            <div className="flex items-center gap-4 self-end">
              {/* <button className="w-8 h-8 flex items-center justify-center rounded-full bg-orange-200">
                <Image src="/filter.png" alt="" width={14} height={14} />
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-full bg-orange-200">
                <Image src="/sort.png" alt="" width={14} height={14} />
              </button> */}
              <FormModal table="users" type="create" onSuccess={fetchUsers} />
            </div>
          </div>
        </div>
        {/* LIST */}
        {loading ? (
          <div>Chargement...</div>
        ) : (
          <Table columns={columns} renderRow={renderRow} data={currentUsers} />
        )}
        {/* PAGINATION */}
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
      
      {/* Modal de visualisation */}
      {selectedUser && (
        <ViewUserModal 
          user={selectedUser} 
          onClose={() => setSelectedUser(null)} 
        />
      )}
    </>
  );
};

export default UsersList;
