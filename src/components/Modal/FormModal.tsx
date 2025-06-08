"use client";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useState } from "react";
import Toast from "../Toast";


const UserForm = dynamic(() => import("../forms/UserForm"), { loading: () => <p>Loading...</p> });

const FormModal = ({
  table,
  type,
  data,
  id,
  isBanned,
  onSuccess,
}: {
  table:
    | "users"
    | "destination"
    | "monument"
    | "tour"
    | "content"
    | "package"
    | "subscription"
    | "contribution"
    | "event"
    | "contacts"
  type: "create" | "edit" | "delete" | "ban";
  data?: any;
  id?: number;
  isBanned?: boolean;
  onSuccess?: () => void;
}) => {
  const size = type === "create" ? "w-8 h-8" : "w-7 h-7";
  const bgColor =
    type === "create" 
      ? "bg-[#c3ebfa]"
      : type === "edit"
      ? "bg-[##c3ebfa]"
      : type === "delete"
      ? "bg-[##A7001E]"
      : type === "ban"
      ? ""
      : "";

   const [open, setOpen] = useState(false);
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState("");
   const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000); // Disparaît après 3 secondes
  };

  const handleSuccess = () => {
    setOpen(false);
    if (onSuccess) {
      onSuccess();
    }
    const messages = {
      create: "Utilisateur ajouté avec succès",
      edit: "Utilisateur modifié avec succès",
      delete: "Utilisateur supprimé avec succès",
      ban: isBanned ? "Utilisateur débanni avec succès" : "Utilisateur banni avec succès"
    };
    showToast(messages[type], 'success');
  };

  const handleDelete = async () => {
    if (!id) return;
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`http://localhost:8000/auth/delete/${id}`, {
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
      const response = await fetch(`http://localhost:8000/auth/toggle-ban/${id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.message || "Erreur lors du bannissement");
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

  const Form = () => {
    if (type === "delete" && id) {
      return (
        <form onSubmit={(e) => { e.preventDefault(); handleDelete(); }} className="p-4 flex flex-col gap-4">
          <span className="text-center font-medium">
            Toutes les données seront perdues. Êtes-vous sûr de vouloir supprimer cet utilisateur ?
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
    } else if (type === "ban" && id) {
      return (
        <form onSubmit={(e) => { e.preventDefault(); handleBan(); }} className="p-4 flex flex-col gap-4">
          <span className="text-center font-medium">
            {isBanned 
              ? "Voulez-vous débannir cet utilisateur ?" 
              : "Voulez-vous bannir cet utilisateur ?"}
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
              className="bg-yellow-600 text-white py-2 px-4 rounded-md hover:bg-yellow-700 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "En cours..." : (isBanned ? "Débannir" : "Bannir")}
            </button>
          </div>
        </form>
      );
    } else {
      return (
        <UserForm 
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
            <div
              className="absolute top-4 right-4 cursor-pointer"
              onClick={() => setOpen(false)}
            >
              <Image src="/close.png" alt="" width={14} height={14} />
            </div>
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

export default FormModal;