"use client";
import { useState } from "react";
import Image from "next/image";
import Toast from "../Toast";
import MonumentForm from "../forms/MonumentForm";

type Props = {
  type: "create" | "edit" | "delete";
  data?: any;
  id?: number;
  onSuccess?: () => void;
};

const MonumentModal = ({ type, data, id, onSuccess }: Props) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSuccess = () => {
    setOpen(false);
    onSuccess?.();
    const messages = {
      create: "Monument ajouté avec succès",
      edit: "Monument modifié avec succès",
      delete: "Monument supprimé avec succès"
    };
    showToast(messages[type], 'success');
  };

  const handleDelete = async () => {
    if (!id) return;
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`http://localhost:8000/monument/delete/${id}`, {
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

  const renderModalContent = () => {
    if (type === "delete") {
      return (
        <form onSubmit={(e) => { e.preventDefault(); handleDelete(); }} className="p-4 flex flex-col gap-4">
          <span className="text-center font-medium">
            Êtes-vous sûr de vouloir supprimer ce monument ? Toutes les données associées seront perdues.
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
              {loading ? "Suppression..." : "Confirmer"}
            </button>
          </div>
        </form>
      );
    }

    return (
      <MonumentForm 
        type={type === "edit" ? "update" : "create"} 
        data={data} 
        onSuccess={handleSuccess}
        onCancel={() => setOpen(false)}
      />
    );
  };

  const getButtonConfig = () => {
    const config = {
      create: {
        size: "w-8 h-8",
        bgColor: "bg-[#c3ebfa]",
        icon: "/create.png"
      },
      edit: {
        size: "w-7 h-7",
        bgColor: "bg-[##c3ebfa]",
        icon: "/edit.png"
      },
      delete: {
        size: "w-7 h-7",
        bgColor: "bg-[##A7001E]",
        icon: "/delete.png"
      }
    };
    return config[type];
  };

  const buttonConfig = getButtonConfig();

  return (
    <>
      <button
        className={`${buttonConfig.size} flex items-center justify-center rounded-full ${buttonConfig.bgColor}`}
        onClick={() => setOpen(true)}
      >
        <Image 
          src={buttonConfig.icon} 
          alt="" 
          width={16} 
          height={16} 
        />
      </button>

      {open && (
        <div className="fixed inset-0 backdrop-blur-md z-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-md relative w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%] max-h-[90vh] overflow-y-auto">
            {renderModalContent()}
            
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

export default MonumentModal;