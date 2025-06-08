"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import { useState } from "react";

// Schéma de validation
const createSchema = z.object({
  nom: z.string().min(3, "Le nom doit comporter au moins 3 caractères"),
  logo: z.instanceof(File).optional()
    .refine(file => !file || file.size <= 5 * 1024 * 1024, "Le fichier doit faire moins de 5MB")
    .refine(file => !file || ['image/jpeg', 'image/png', 'image/webp'].includes(file.type), "Seuls les formats JPEG, PNG et WEBP sont acceptés")
});

const updateSchema = createSchema;

type CreateInputs = z.infer<typeof createSchema>;
type UpdateInputs = z.infer<typeof updateSchema>;

const ReferenceForm = ({
  type,
  data,
  onSuccess,
  onCancel,
}: {
  type: "create" | "update";
  data?: any;
  onSuccess?: () => void;
  onCancel?: () => void;
}) => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm({
    resolver: zodResolver(type === "create" ? createSchema : updateSchema),
    defaultValues: type === "update" ? {
      nom: data?.nom || '',
      logo: null
    } : undefined
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("logo", file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const onSubmit = handleSubmit(async (formData) => {
    const token = localStorage.getItem("token");
    const formDataToSend = new FormData();
    
    formDataToSend.append('nom', formData.nom);
    if (formData.logo) {
      formDataToSend.append('logo', formData.logo);
    }
  
    try {
      const url = type === "create" 
        ? "http://localhost:8000/reference"
        : `http://localhost:8000/reference/${data.id}`; // Supprimé 'update/'
  
      const method = type === "create" ? "POST" : "PATCH";
  
      const response = await fetch(url, {
        method,
        headers: {
          "Authorization": `Bearer ${token}`,
          // Ne pas mettre 'Content-Type' pour FormData, le navigateur le fera automatiquement
          // avec le bon boundary
        },
        credentials: 'include',
        body: formDataToSend
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.message || "Erreur lors de l'opération");
      }
  
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Erreur:", error);
    }
  });

  return (
    <form className="flex flex-col gap-8 p-4" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Créer une nouvelle référence" : "Modifier la référence"}
      </h1>      
      
      <div className="grid grid-cols-1 gap-6">
        <InputField
          label="Nom de la référence"
          name="nom"
          register={register}
          error={errors?.nom}
          className="w-full"
        />
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Logo
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
          {errors?.logo && (
            <p className="mt-1 text-sm text-red-600">{errors.logo.message as string}</p>
          )}
          {previewImage && (
            <div className="mt-2">
              <img 
                src={previewImage} 
                alt="Preview" 
                className="h-20 w-20 object-contain border rounded"
              />
            </div>
          )}
          {type === "update" && data?.logo && !previewImage && (
            <div className="mt-2">
              <p className="text-sm text-gray-500">Logo actuel :</p>
              <img 
                src={data.logo} 
                alt="Logo actuel" 
                className="h-20 w-20 object-contain border rounded"
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-2 justify-end mt-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2.5 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-100"
          >
            Annuler
          </button>
        )}
        <button className="bg-blue-400 text-white px-6 py-2.5 rounded-md hover:bg-blue-500">
          {type === "create" ? "Créer" : "Modifier"}
        </button>
      </div>
    </form>
  );
};

export default ReferenceForm;