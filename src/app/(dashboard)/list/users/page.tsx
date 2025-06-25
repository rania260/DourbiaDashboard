"use client";
import { useEffect, useState } from "react";
import FormModal from "@/components/Modal/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import Image from "next/image";
import ViewUserModal from "@/components/ViewDetails/ViewUserModal";

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
  types?: string[];
  description?: string;
  regions?: string[];
  services?: string[];
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
  const [searchTerm, setSearchTerm] = useState('');
const [isSearching, setIsSearching] = useState(false);

  const itemsPerPage = 5;

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch('http://localhost:8000/auth/getAll', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        if (response.status === 401) {
          // Token invalide ou expiré
          localStorage.removeItem('token');
          throw new Error('Session expirée. Veuillez vous reconnecter.');
        }
        throw new Error(errorData?.message || 'Failed to fetch users');
      }

      const data = await response.json();
      
      // Ajout d'un identifiant unique si id est manquant
      const usersWithUniqueIds = data.map((user: User, index: number) => ({
        ...user,
        uniqueId: user.id ? user.id.toString() : `temp-${index}-${Date.now()}`
      }));
      
      // Filtrer les utilisateurs selon les rôles autorisés
      const allowedRoles = ['USER', 'SUPERADMIN', 'ADMIN'];
      const filteredUsers = usersWithUniqueIds.filter((user: User) => 
        allowedRoles.includes(user.role)
      );
      
      const sortedData = [...filteredUsers].sort((a, b) => parseInt(a.uniqueId) - parseInt(b.uniqueId));
      setUsers(sortedData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
      setLoading(false);
      // Vous pouvez afficher un message d'erreur à l'utilisateur ici
      console.error('Error details:', error);
    }
  };

  
  const handleSearch = async (term: string) => {
    if (term.trim() === '') {
      fetchUsers();
      return;
    }
  
    setIsSearching(true);
    try {
      const response = await fetch(`http://localhost:8000/auth/search?username=${encodeURIComponent(term)}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        credentials: 'include',
      });
      
      if (!response.ok) throw new Error('Search failed');
      
      const data = await response.json();
      const usersWithUniqueIds = data.map((user: User, index: number) => ({
        ...user,
        uniqueId: user.id ? user.id.toString() : `temp-${index}-${Date.now()}`
      }));
      setUsers(usersWithUniqueIds);
    } catch (error) {
      console.error('Search error:', error);
      // Optionnel: Afficher un message à l'utilisateur
    } finally {
      setIsSearching(false);
    }
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    handleSearch(term);
  };
  
  // Modifiez votre rendu pour le champ de recherche :
  <div className="w-full md:w-auto flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2">
    <Image src="/search.png" alt="Search icon" width={14} height={14} />
    <input
      type="text"
      placeholder="Search..."
      className="w-[200px] p-2 bg-transparent outline-none"
      value={searchTerm}
      onChange={handleSearchChange}
      disabled={isSearching}
    />
    {isSearching && <span>Searching...</span>}
  </div>
  
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

  const renderRow = (item: User & { uniqueId: string }) => {
    const verification = item.emailVerifiedAt ? "Oui" : "Non";

    const rowClassName = item.isBanned
      ? "border-b border-gray-200 even:bg-slate-50 text-sm text-[#8F8F8F]"
      : "border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-[#EBF2F6]";

    return (
      <tr key={item.uniqueId} className={rowClassName}>
        <td className="flex items-center gap-4 p-4">
          <Image
            src={item.avatar || '/avatar.jpeg'}
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
        <td className="hidden md:table-cell">{item.id || 'N/A'}</td>
        <td className="hidden md:table-cell">{item.role}</td>
        <td className="hidden md:table-cell">{item.phone}</td>
        <td className="hidden md:table-cell">{item.country}</td>
        <td className="hidden md:table-cell">{item.region}</td>
        <td>{verification}</td>
        <td>
          <span className={`px-2 py-1 rounded-full text-xs ${item.isBanned
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
        <div className="flex items-center justify-between">
          <h1 className="hidden md:block text-lg font-semibold">Tous les utilisateurs</h1>
          <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
            <div className="w-full md:w-auto flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2">
              <Image src="/search.png" alt="" width={14} height={14} />
              <input
  type="text"
  placeholder="Search..."
  className="w-[200px] p-2 bg-transparent outline-none"
  value={searchTerm}
  onChange={handleSearchChange}
/>

            </div>
            <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
              <FormModal table="users" type="create" onSuccess={fetchUsers} />
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