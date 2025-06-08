"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";

// Modifiez les schémas pour inclure le champ geom
const createSchema = z.object({
  nom: z.string().min(3, "Le nom doit comporter au moins 3 caractères"),
  description: z.string().min(10, "La description doit comporter au moins 10 caractères"),
  image: z.string().url("L'URL de l'image doit être valide"),
  adresse: z.string().optional(),
  code_postal: z.string().optional(),
  ville: z.string().optional(),
  telephone: z.string().optional(),
  email: z.string().email("Email invalide").optional(),
  site_web: z.string().url("URL du site web invalide").or(z.literal("")).optional(),
});

const updateSchema = createSchema;

type CreateInputs = z.infer<typeof createSchema>;
type UpdateInputs = z.infer<typeof updateSchema>;

const DestinationForm = ({
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
      description: data?.description || '',
      image: data?.image || '',
      adresse: data?.adresse || '',
      code_postal: data?.code_postal || '',
      ville: data?.ville || '',
      telephone: data?.telephone || '',
      email: data?.email || '',
      site_web: data?.site_web || '',
    } : undefined
  });


  const onSubmit = handleSubmit(async (formData) => {
    const token = localStorage.getItem("token");
    
    try {
      const url = type === "create" 
        ? "http://localhost:8000/destination/create"
        : `http://localhost:8000/destination/update/${data.id}`;

      const response = await fetch(url, {
        method: type === "create" ? "POST" : "PATCH",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify(formData)
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
        {type === "create" ? "Créer une nouvelle destination" : "Modifier la destination"}
      </h1>      
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField
          label="Nom de la destination"
          name="nom"
          register={register}
          error={errors?.nom}
          className="w-full"
        />
        <InputField
          label="URL de l'image"
          name="image"
          register={register}
          error={errors?.image}
          className="w-full"
        />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <InputField
          label="Description"
          name="description"
          type="textarea"
          register={register}
          error={errors?.description}
          className="w-full"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField
          label="Adresse"
          name="adresse"
          register={register}
          error={errors?.adresse}
          className="w-full"
        />
        <InputField
          label="Ville"
          name="ville"
          register={register}
          error={errors?.ville}
          className="w-full"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <InputField
          label="Code postal"
          name="code_postal"
          register={register}
          error={errors?.code_postal}
          className="w-full"
        />
        <InputField
          label="Téléphone"
          name="telephone"
          register={register}
          error={errors?.telephone}
          className="w-full"
        />
        <InputField
          label="Email"
          name="email"
          register={register}
          error={errors?.email}
          className="w-full"
        />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <InputField
          label="Site web"
          name="site_web"
          register={register}
          error={errors?.site_web}
          className="w-full"
        />
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

export default DestinationForm;