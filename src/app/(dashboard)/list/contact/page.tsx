// "use client";
// import { useEffect, useState } from "react";
// import Table from "@/components/Table";
// import Pagination from "@/components/Pagination";
// import TableSearch from "@/components/TableSearch";
// import FormModal from "@/components/FormModal"; // À adapter ou désactiver selon ta logique
// import Image from "next/image";

// type Contact = {
//   id: number;
//   nom: string;
//   phone: string;
//   email: string;
//   object: string;
//   message: string;
// };

// const columns = [
//   { header: "Nom", accessor: "nom" },
//   { header: "Téléphone", accessor: "phone", className: "hidden md:table-cell" },
//   { header: "Email", accessor: "email", className: "hidden md:table-cell" },
//   { header: "Objet", accessor: "object", className: "hidden lg:table-cell" },
//   { header: "Message", accessor: "message" },
//   { header: "Actions", accessor: "action" },
// ];

// const ContactRequestsList = () => {
//   const [contacts, setContacts] = useState<Contact[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 5;

//   const fetchContacts = async () => {
//     try {
//       const response = await fetch("http://localhost:8000/contact/getAll");
//       if (response.ok) {
//         const data = await response.json();
//         setContacts(data);
//       } else {
//         console.error("Erreur lors du chargement des demandes de contact");
//       }
//     } catch (error) {
//       console.error("Erreur fetch:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchContacts();
//   }, []);

//   const indexOfLast = currentPage * itemsPerPage;
//   const indexOfFirst = indexOfLast - itemsPerPage;
//   const currentData = contacts.slice(indexOfFirst, indexOfLast);
//   const totalPages = Math.ceil(contacts.length / itemsPerPage);

//   const handlePageChange = (page: number) => {
//     setCurrentPage(page);
//   };
//   const truncateMessage = (message: string, wordLimit = 10) => {
//     const words = message.split(" ");
//     if (words.length <= wordLimit) return message;
//     return words.slice(0, wordLimit).join(" ") + " ...";
//   };
  
//   const renderRow = (contact: Contact) => (
//     <tr key={contact.id} className="border-b even:bg-slate-50 text-sm hover:bg-[#EBF2F6]">
//       <td className="p-4 ">{contact.nom}</td>
//       <td className="hidden md:table-cell">{contact.phone}</td>
//       <td className="hidden md:table-cell">{contact.email}</td>
//       <td className="hidden lg:table-cell">{contact.object}</td>
//       <td className="px-4 max-w-[250px] text-ellipsis overflow-hidden whitespace-nowrap">
//   {truncateMessage(contact.message, 10)}
// </td>

//       <td>
//         <div className="flex items-center gap-2">
//           <button className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-100">
//             <Image src="/view.png" alt="Voir" width={16} height={16} />
//           </button>
//           <FormModal table="contacts" type="edit" id={contact.id} data={contact} onSuccess={fetchContacts} />
//         </div>
//       </td>
//     </tr>
//   );

//   return (
//     <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
//       <div className="flex items-center justify-between mb-4">
//         <h1 className="text-lg font-semibold">Demandes de Contact</h1>
//         <div className="flex items-center gap-4">
//           <TableSearch />
//         </div>
//       </div>
//       {loading ? (
//         <div>Chargement...</div>
//       ) : (
//         <Table columns={columns} renderRow={renderRow} data={currentData} />
//       )}
//       <Pagination
//         currentPage={currentPage}
//         totalPages={totalPages}
//         onPageChange={handlePageChange}
//       />
//     </div>
//   );
// };

// export default ContactRequestsList;
"use client";
import { useEffect, useState } from "react";
import Table from "@/components/Table";
import Pagination from "@/components/Pagination";
import TableSearch from "@/components/TableSearch";
import FormModal from "@/components/Modal/FormModal";
import Image from "next/image";

type Contact = {
  id: number;
  nom: string;
  phone: string;
  email: string;
  object: string;
  message: string;
};

const columns = [
  { header: "Information", accessor: "info" },
  { header: "Téléphone", accessor: "phone", className: "text-left px-4" },
  { header: "Objet", accessor: "object", className: "hidden md:table-cell" },
  { header: "Message", accessor: "message", className: "text-left px-4" },
  { header: "Actions", accessor: "action" },
];

const ContactRequestsList = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchContacts = async () => {
    try {
      const response = await fetch("http://localhost:8000/contact/getAll");
      if (response.ok) {
        const data = await response.json();
        setContacts(data);
      } else {
        console.error("Erreur lors du chargement des demandes de contact");
      }
    } catch (error) {
      console.error("Erreur fetch:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentData = contacts.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(contacts.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const truncateMessage = (message: string, wordLimit = 10) => {
    const words = message.split(" ");
    return words.length <= wordLimit ? message : words.slice(0, wordLimit).join(" ") + " ...";
  };

  const renderRow = (contact: Contact) => (
    <tr
      key={contact.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-[#EBF2F6]"
    >
      {/* INFORMATION */}
      <td className="p-4">
        <div className="flex flex-col">
          <span className="font-semibold">{contact.nom}</span>
          <span className="text-xs text-gray-500">{contact.email}</span>

        </div>
      </td>
  {/* TELEPHONE */}
  <td className="text-left px-4">{contact.phone}</td>
      {/* OBJET */}
      <td className="hidden md:table-cell">{contact.object}</td>

      {/* MESSAGE */}
      <td className="max-w-[250px] px-4 truncate">{truncateMessage(contact.message, 10)}</td>

      {/* ACTIONS */}
      <td>
        <div className="flex items-center gap-2">
          <button className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200">
            <Image src="/view.png" alt="Voir" width={16} height={16} />
          </button>
          <FormModal
            table="contacts"
            type="edit"
            id={contact.id}
            data={contact}
            onSuccess={fetchContacts}
          />
          <FormModal
            table="contacts"
            type="delete"
            id={contact.id}
            onSuccess={fetchContacts}
          />
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP BAR */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-semibold">Demandes de Contact</h1>
        <div className="flex items-center gap-4">
          <TableSearch />
        </div>
      </div>

      {/* TABLE & PAGINATION */}
      {loading ? (
        <div>Chargement...</div>
      ) : (
        <>
          <Table columns={columns} renderRow={renderRow} data={currentData} />
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

export default ContactRequestsList;
