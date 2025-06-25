"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import Select from "react-select";
// Schéma de validation
const createSchema = z.object({
  username: z.string().min(3, "Le nom d'utilisateur doit comporter au moins 3 caractères"),
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Le mot de passe doit comporter au moins 6 caractères").optional(),
  avatar: z.string().url("URL invalide").or(z.literal("")).optional(),
  phone: z.string().optional(),
  country: z.string().optional(),
  region: z.string().optional(),
  specialities: z.array(z.string()).min(1, "Au moins une spécialité est requise"),
  description: z.string().optional(),
  epochs: z.array(z.string()).min(1, "Au moins une époque est requise"),
});

const updateSchema = createSchema.omit({ password: true }).extend({
  password: z.string().min(6, "Le mot de passe doit comporter au moins 6 caractères").optional(),
});

type CreateInputs = z.infer<typeof createSchema>;
type UpdateInputs = z.infer<typeof updateSchema>;

const ExpertForm = ({
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
    watch,
  } = useForm({
    resolver: zodResolver(type === "create" ? createSchema : updateSchema),
    defaultValues: type === "update" ? {
      ...data,
      specialities: data?.specialities || [],
      epochs: data?.epochs || [],
    } : {
      specialities: [],
      epochs: [],
    }
  });

  const onSubmit = handleSubmit(async (formData) => {
    const token = localStorage.getItem("token");
    
    try {
      const url = type === "create" 
        ? "http://localhost:8000/experts/add"
        : `http://localhost:8000/experts/update/${data.id}`;

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

  // Options pour les spécialités
  const specialityOptions = [
    { value: "archéologue", label: "Archéologue" },
    { value: "historien", label: "Historien" },
    { value: "architecte", label: "Architecte" },
    { value: "restaurateur", label: "Restaurateur" },
    { value: "guide", label: "Guide touristique" },
  ];

  // Options pour les époques
  const epochOptions = [
    { value: "punique", label: "Punique" },
    { value: "romaine", label: "Romaine" },
    { value: "byzantine", label: "Byzantine" },
    { value: "beylicale", label: "Beylicale" },
    { value: "coloniale", label: "Coloniale" },
    { value: "moderne", label: "Moderne" },
  ];

  return (
    <form className="flex flex-col gap-8 p-4" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Ajouter un nouvel expert" : "Modifier l'expert"}
      </h1>      
      
      {/* Section 1: Informations de base */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField
          label="Nom d'utilisateur*"
          name="username"
          register={register}
          error={errors?.username}
          className="w-full"
        />
        <InputField
          label="Email*"
          name="email"
          type="email"
          register={register}
          error={errors?.email}
          className="w-full"
        />
      </div>

      {type === "create" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Mot de passe*"
            name="password"
            type="password"
            register={register}
            error={errors?.password}
            className="w-full"
          />
          <InputField
            label="Avatar (URL)"
            name="avatar"
            register={register}
            error={errors?.avatar}
            className="w-full"
          />
        </div>
      )}

      {/* Section 2: Contact */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <InputField
          label="Téléphone"
          name="phone"
          register={register}
          error={errors?.phone}
          className="w-full"
        />
        <InputField
          label="Pays"
          name="country"
          register={register}
          error={errors?.country}
          className="w-full"
        />
        <InputField
          label="Région"
          name="region"
          register={register}
          error={errors?.region}
          className="w-full"
        />
      </div>

      {/* Section 3: Spécialités - React Select multiselect */}
      <div className="grid grid-cols-1 gap-4">
        <label htmlFor="specialities" className="block text-sm font-medium text-gray-700">Spécialités*</label>
        <Select
          id="specialities"
          instanceId="specialities"
          isMulti
          options={specialityOptions}
          className="react-select-container"
          classNamePrefix="react-select"
          value={specialityOptions.filter(opt => (watch("specialities") || []).includes(opt.value))}
          onChange={selected => {
            setValue("specialities", (selected as any[]).map(opt => opt.value));
          }}
          placeholder="Sélectionnez une ou plusieurs spécialités..."
        />
        {errors?.specialities && <p className="mt-1 text-sm text-red-600">{errors.specialities.message}</p>}
      </div>

      {/* Section 4: Description */}
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

      {/* Section 5: Époques - React Select multiselect */}
      <div className="grid grid-cols-1 gap-4">
        <label htmlFor="epochs" className="block text-sm font-medium text-gray-700">Époques de spécialisation*</label>
        <Select
          id="epochs"
          instanceId="epochs"
          isMulti
          options={epochOptions}
          className="react-select-container"
          classNamePrefix="react-select"
          value={epochOptions.filter(opt => (watch("epochs") || []).includes(opt.value))}
          onChange={selected => {
            setValue("epochs", (selected as any[]).map(opt => opt.value));
          }}
          placeholder="Sélectionnez une ou plusieurs époques..."
        />
        {errors?.epochs && <p className="mt-1 text-sm text-red-600">{errors.epochs.message}</p>}
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
        <button 
          type="submit"
          className="bg-blue-400 text-white px-6 py-2.5 rounded-md hover:bg-blue-500"
        >
          {type === "create" ? "Créer" : "Modifier"}
        </button>
      </div>
    </form>
  );
};

export default ExpertForm;