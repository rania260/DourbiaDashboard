"use client";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useState } from "react";
import Toast from "../Toast";
import ServiceForm from "../forms/ServiceForm";

const ServiceModal = ({
  table,
  type,
  data,
  id,
  onSuccess,
}: {
  table: "services";
  type: "create" | "edit" | "delete";
  data?: any;
  id?: string;
  onSuccess?: () => void;
}) => {
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const size = type === "create" ? "w-8 h-8" : "w-7 h-7";
  const bgColor =
    type === "create" 
      ? "bg-[#c3ebfa]"
      : type === "edit"
      ? "bg-[#c3ebfa]"
      : type === "delete"
      ? "bg-[#A7001E]"
      : "";

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSuccess = () => {
    setOpen(false);
    if (onSuccess) {
      onSuccess();
      const messages = {
        create: "Service ajouté avec succès",
        edit: "Service modifié avec succès",
        delete: "Service supprimé avec succès !"
      };
      showToast(messages[type], 'success');
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`http://localhost:8000/services/delete/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.message || "Erreur lors de la suppression");
      }

      handleSuccess();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Une erreur est survenue";
      setError(errorMessage);
      showToast("Une erreur est survenue lors de la suppression du service", 'error');
    } finally {
      setLoading(false);
    }
  };

  const Form = () => {
    if (type === "delete" && id) {
      return (
        <form onSubmit={(e) => { e.preventDefault(); handleDelete(); }} className="p-4 flex flex-col gap-4">
          <span className="text-center font-medium">
            Toutes les données seront perdues. Êtes-vous sûr de vouloir supprimer ce service ?
          </span>
          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}
          <div className="flex gap-2 justify-center">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-100"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Suppression..." : "Supprimer"}
            </button>
          </div>
        </form>
      );
    } else {
      return (
        <ServiceForm 
          type={type === "edit" ? "update" : "create"} 
          data={data} 
          onSuccess={handleSuccess}
          onCancel={() => setOpen(false)}
        />
      );
    }
  };

  return (
    <>
      <button
        className={`${size} flex items-center justify-center rounded-full ${bgColor}`}
        onClick={() => setOpen(true)}
      >
        <Image 
          src={`/${type}.png`} 
          alt="" 
          width={16} 
          height={16}
        />
      </button>
      {open && (
        <div className="fixed inset-0 backdrop-blur-md z-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-md relative w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%]">
            <Form />
          </div>
        </div>
      )}
      {toast && (
        <Toast
          message={toast?.message}
          type={toast?.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
};

export default ServiceModal;
