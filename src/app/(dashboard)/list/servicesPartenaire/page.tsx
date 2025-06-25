"use client";

import { useEffect, useState, useCallback } from "react";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import Image from "next/image";
import ViewServiceModal from "@/components/ViewDetails/ViewServiceModal";
import ServiceModal from "@/components/Modal/ServiceModal";

const ServicesList = () => {
  const [services, setServices] = useState<any[]>([]);
  const [filteredServices, setFilteredServices] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedService, setSelectedService] = useState<any | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const columns = [
    { header: "Service", accessor: "service" },
    { header: "Type", accessor: "type" },
    { header: "Description", accessor: "description", className: "hidden lg:table-cell" },
    { header: "Régions", accessor: "regions", className: "hidden lg:table-cell" },
    { header: "Prix", accessor: "prix" },
    { header: "Actions", accessor: "action" },
  ];  

  const fetchServices = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:8000/services/getAll", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setServices(data);
        setFilteredServices(data);
      } else {
        console.error("Erreur lors du chargement des services");
      }
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const indexOfLastService = currentPage * itemsPerPage;
  const indexOfFirstService = indexOfLastService - itemsPerPage;
  const currentServices = filteredServices.slice(indexOfFirstService, indexOfLastService);
  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const renderRow = (item: any) => {
    const rowClassName = "border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-[#EBF2F6]";
  
    return (
      <tr key={item.id} className={rowClassName}>
        <td className="p-4">{item.service}</td>
        <td className="p-4">{item.type}</td>
        <td className="hidden lg:table-cell p-4">{item.description}</td>
        <td className="hidden lg:table-cell p-4">
          {item.regions && item.regions.length > 0 ? item.regions.join(", ") : "N/A"}
        </td>
        <td className="p-4">{item.prix || "N/A"}</td>
        <td className="p-4">
          <div className="flex items-center gap-2">
            <button
              className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100"
              onClick={() => setSelectedService(item)}
              title="Voir détails"
            >
              <Image src="/view.png" alt="Voir" width={16} height={16} />
            </button>
            <ServiceModal
              table="services"
              type="edit"
              id={item.id}
              data={item}
              onSuccess={() => {
                setLoading(true);
                setTimeout(() => window.location.reload(), 500);
              }}
            />
            <ServiceModal
              table="services"
              type="delete"
              id={item.id}
              onSuccess={() => {
                setLoading(true);
                setTimeout(() => window.location.reload(), 500);
              }}
            />
          </div>
        </td>
      </tr>
    );
  };
  

  return (
    <>
      <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
        <div className="flex items-center justify-between">
          <h1 className="hidden md:block text-lg font-semibold">Gestion des Services</h1>
          <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
            <TableSearch />
            <div className="flex items-center gap-4 self-end">
              <ServiceModal
                table="services"
                type="create"
                onSuccess={() => {
                  setLoading(true);
                  setTimeout(() => {
                    window.location.reload();
                  }, 500);
                }}
              />
            </div>
          </div>
        </div>
        {loading ? (
          <div>Chargement...</div>
        ) : (
          <Table columns={columns} renderRow={renderRow} data={currentServices} />
        )}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>

      {selectedService && (
        <ViewServiceModal
          service={selectedService}
          onClose={() => setSelectedService(null)}
        />
      )}
    </>
  );
};

export default ServicesList;
