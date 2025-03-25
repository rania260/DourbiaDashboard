"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";

// Déplacer la définition du schéma avant son utilisation
const createSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Le nom d'utilisateur doit comporter au moins 3 caractères !" })
    .max(20, { message: "Le nom d'utilisateur doit comporter au maximum 20 caractères !" }),
  email: z.string().email({ message: "Adresse email invalide !" }),
  password: z
    .string()
    .min(8, { message: "Le mot de passe doit comporter au moins 8 caractères !" }),
  phone: z.string().min(1, { message: "Le téléphone est requis !" }),
  country: z.string().min(1, { message: "Le pays est requis !" }),
  role: z.string().min(1, { message: "Le rôle est requis !" }),
  region: z.string().min(1, { message: "La région est requise !" }),
});

const updateSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Le nom d'utilisateur doit comporter au moins 3 caractères !" })
    .max(20, { message: "Le nom d'utilisateur doit comporter au maximum 20 caractères !" }),
  email: z.string().email({ message: "Adresse email invalide !" }),
  phone: z.string().min(1, { message: "Le téléphone est requis !" }),
  country: z.string().min(1, { message: "Le pays est requis !" }),
  role: z.string().min(1, { message: "Le rôle est requis !" }),
  region: z.string().min(1, { message: "La région est requise !" }),
});

type CreateInputs = z.infer<typeof createSchema>;
type UpdateInputs = z.infer<typeof updateSchema>;

const UserForm = ({
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
  } = useForm({
    resolver: zodResolver(type === "create" ? createSchema : updateSchema),
    defaultValues: type === "update" ? {
      username: data?.username || '',
      email: data?.email || '',
      phone: data?.phone || '',
      country: data?.country || '',
      region: data?.region || '',
      role: data?.role || '',
    } : undefined
  });

  const onSubmit = handleSubmit(async (formData) => {
    const token = localStorage.getItem("token");
    
    try {
      const url = type === "create" 
        ? "http://localhost:8000/auth/create"
        : `http://localhost:8000/auth/update/${data.id}`;

      const response = await fetch(url, {
        method: type === "create" ? "POST" : "PATCH",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
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
        {type === "create" ? "Créer un nouvel utilisateur" : "Modifier l'utilisateur"}
      </h1>      
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField
          label="Nom d'utilisateur"
          name="username"
          defaultValue={data?.username}
          register={register}
          error={errors?.username}
          className="w-full"
        />
        <InputField
          label="Email"
          name="email"
          defaultValue={data?.email}
          register={register}
          error={errors?.email}
          className="w-full"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {type === "create" ? (
          <InputField
            label="Mot de passe"
            name="password"
            type="password"
            register={register}
            error={errors?.password}
            className="w-full"
          />
        ) : null}
        <InputField
          label="Téléphone"
          name="phone"
          defaultValue={data?.phone}
          register={register}
          error={errors?.phone}
          className="w-full"
        />
        {type === "create" ? null : (
          <InputField
            label="Pays"
            name="country"
            defaultValue={data?.country}
            register={register}
            error={errors?.country}
            className="w-full"
          />
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {type === "create" && (
          <InputField
            label="Pays"
            name="country"
            defaultValue={data?.country}
            register={register}
            error={errors?.country}
            className="w-full"
          />
        )}
        <InputField
          label="Région"
          name="region"
          defaultValue={data?.region}
          register={register}
          error={errors?.region}
          className="w-full"
        />
        <div className="flex flex-col gap-2 w-full">
          <label className="text-xs text-gray-500">Rôle</label>
          <div className="relative">
            <select
              className="appearance-none w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent cursor-pointer h-[42px]"
              {...register("role")}
              defaultValue={data?.role}
            >
              <option value="" className="text-gray-400">Sélectionner un rôle</option>
              <option value="USER" className="py-2">Utilisateur</option>
              <option value="ADMIN" className="py-2">Administrateur</option>
              <option value="SUPERADMIN" className="py-2">Super Admin</option>
              <option value="EXPERT" className="py-2">Expert</option>
              <option value="PARTENAIRE" className="py-2">Partenaire</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg 
                className="w-4 h-4 text-gray-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
          {errors.role?.message && (
            <p className="text-xs text-red-400 mt-1">{errors.role.message}</p>
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

export default UserForm;