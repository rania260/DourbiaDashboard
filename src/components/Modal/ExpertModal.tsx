"use client";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useState } from "react";
import Toast from "../Toast";

const ExpertForm = dynamic(() => import("../forms/ExpertForm"), { 
  loading: () => <p>Chargement...</p> 
});

const ExpertModal = ({
  table,
  type,
  data,
  id,
  isBanned,
  onSuccess,
}: {
  table: "experts";
  type: "create" | "edit" | "delete" | "ban";
  data?: any;
  id?: number;
  isBanned?: boolean;
  onSuccess?: () => void;
}) => {
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const size = type === "create" ? "w-8 h-8" : "w-7 h-7";
  const bgColor =
    type === "create" 
      ? "bg-[#c3ebfa]"
      : type === "edit"
      ? "bg-[##c3ebfa]"
      : type === "delete"
      ? "bg-[##A7001E]"
      : type === "ban"
      ? "bg-[##A7001E]"
      : "";

  const handleSuccess = () => {
    setOpen(false);
    if (onSuccess) {
      onSuccess();
      const messages = {
        create: "Expert ajouté avec succès",
        edit: "Expert modifié avec succès",
        delete: "Expert supprimé avec succès",
        ban: "Statut mis à jour avec succès"
      };
      showToast(messages[type], 'success');
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`http://localhost:8000/experts/delete/${id}`, {
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
      showToast(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleBan = async () => {
    if (!id) return;
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`http://localhost:8000/experts/ban/${id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ isBanned: !isBanned })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.message || "Erreur lors du changement de statut");
      }

      handleSuccess();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Une erreur est survenue";
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const FormContent = () => {
    if (type === "delete" && id) {
      return (
        <form onSubmit={(e) => { e.preventDefault(); handleDelete(); }} className="p-4 flex flex-col gap-4">
          <span className="text-center font-medium">
            Êtes-vous sûr de vouloir supprimer cet expert ? Toutes ses données seront perdues.
          </span>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
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
    } else if (type === "ban" && id) {
      return (
        <form onSubmit={(e) => { e.preventDefault(); handleBan(); }} className="p-4 flex flex-col gap-4">
          <span className="text-center font-medium">
            {isBanned 
              ? "Voulez-vous réactiver cet expert ?" 
              : "Voulez-vous désactiver cet expert ?"}
          </span>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
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
              className="bg-yellow-600 text-white py-2 px-4 rounded-md hover:bg-yellow-700 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "En cours..." : (isBanned ? "Réactiver" : "Désactiver")}
            </button>
          </div>
        </form>
      );
    } else {
      return (
        <ExpertForm 
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
          className="filter contrast-75"
        />
      </button>
      
      {open && (
        <div className="fixed inset-0 backdrop-blur-md z-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-md relative w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%] max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setOpen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            <FormContent />
          </div>
        </div>
      )}
      
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
};

export default ExpertModal;