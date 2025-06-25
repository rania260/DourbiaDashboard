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
  types: z.array(z.string()).optional(),
  description: z.string().optional(),
  regions: z.array(z.string()).optional(),
  services: z.array(z.string()).optional(),
});

const updateSchema = createSchema.omit({ password: true }).extend({
  password: z.string().min(6, "Le mot de passe doit comporter au moins 6 caractères").optional(),
});

type CreateInputs = z.infer<typeof createSchema>;
type UpdateInputs = z.infer<typeof updateSchema>;

const PartnerForm = ({
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
      types: data?.types || [],
      regions: data?.regions || [],
      services: data?.services || [],
    } : {
      types: [],
      regions: [],
      services: [],
    }
  });

  const onSubmit = handleSubmit(async (formData) => {
    const token = localStorage.getItem("token");
    
    try {
      const url = type === "create" 
        ? "http://localhost:8000/partners/add"
        : `http://localhost:8000/partners/update/${data.id}`;

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

  // Options pour les types de partenaires
  const typeOptions = [
    { value: "Hotel", label: "Hôtel" },
    { value: "Restaurant", label: "Restaurant" },
    { value: "Experience VR", label: "Expérience VR" },
  ];

  // Options pour les régions de Tunisie
  const regionOptions = [
    { value: "Tunis", label: "Tunis" },
    { value: "Sousse", label: "Sousse" },
    { value: "Bizerte", label: "Bizerte" },
    { value: "Sfax", label: "Sfax" },
    { value: "Djerba", label: "Djerba" },
    { value: "Hammamet", label: "Hammamet" },
    { value: "Nabeul", label: "Nabeul" },
    { value: "Kairouan", label: "Kairouan" },
  ];

  return (
    <div className="flex flex-col h-full max-h-[90vh] bg-white   relative">
      {/* Close (X) button */}
      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          className="absolute top-3 right-4 text-gray-400 hover:text-gray-700 text-2xl font-bold z-20"
          aria-label="Fermer"
        >
          ×
        </button>
      )}
      {/* Title */}
      <div className="px-6 pt-6 pb-2 border-b border-gray-100">
        <h1 className="text-xl font-semibold">
          {type === "create" ? "Ajouter un nouveau partenaire" : "Modifier le partenaire"}
        </h1>
      </div>
      {/* Scrollable content */}
      <form className="flex-1 flex flex-col gap-8 px-6 py-4 overflow-y-auto" onSubmit={onSubmit}>
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
        {/* Section 3: Types de partenaires - React Select multiselect */}
        <div className="grid grid-cols-1 gap-4">
          <label htmlFor="types" className="block text-sm font-medium text-gray-700">Types de partenaires*</label>
          <Select
            id="types"
            instanceId="types"
            isMulti
            options={typeOptions}
            className="react-select-container"
            classNamePrefix="react-select"
            value={typeOptions.filter(opt => (watch("types") || []).includes(opt.value))}
            onChange={selected => {
              setValue("types", (selected as any[]).map(opt => opt.value));
            }}
            placeholder="Sélectionnez un ou plusieurs types..."
          />
          {errors?.types && <p className="mt-1 text-sm text-red-600">{errors.types.message}</p>}
        </div>
        {/* Section 4: Services proposés - React Select multiselect */}
        <div className="grid grid-cols-1 gap-4">
          <label htmlFor="services" className="block text-sm font-medium text-gray-700">Services proposés</label>
          <Select
            id="services"
            instanceId="services"
            isMulti
            options={[
              { value: "Hébergement", label: "Hébergement" },
              { value: "Restauration", label: "Restauration" },
              { value: "Visite Guidée", label: "Visite Guidée" },
              { value: "Transport", label: "Transport" },
              { value: "Expérience VR", label: "Expérience VR" },
            ]}
            className="react-select-container"
            classNamePrefix="react-select"
            value={[
              { value: "Hébergement", label: "Hébergement" },
              { value: "Restauration", label: "Restauration" },
              { value: "Visite Guidée", label: "Visite Guidée" },
              { value: "Transport", label: "Transport" },
              { value: "Expérience VR", label: "Expérience VR" },
            ].filter(opt => (watch("services") || []).includes(opt.value))}
            onChange={selected => {
              setValue("services", (selected as any[]).map(opt => opt.value));
            }}
            placeholder="Sélectionnez un ou plusieurs services..."
          />
          {errors?.services && <p className="mt-1 text-sm text-red-600">{errors.services.message}</p>}
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
        {/* Section 5: Régions couvertes - React Select multiselect */}
        <div className="grid grid-cols-1 gap-4">
          <label htmlFor="regions" className="block text-sm font-medium text-gray-700">Régions couvertes*</label>
          <Select
            id="regions"
            instanceId="regions"
            isMulti
            options={regionOptions}
            className="react-select-container"
            classNamePrefix="react-select"
            value={regionOptions.filter(opt => (watch("regions") || []).includes(opt.value))}
            onChange={selected => {
              setValue("regions", (selected as any[]).map(opt => opt.value));
            }}
            placeholder="Sélectionnez une ou plusieurs régions..."
          />
          {errors?.regions && <p className="mt-1 text-sm text-red-600">{errors.regions.message}</p>}
        </div>
        {/* Spacer for action bar */}
        <div className="h-2" />
      </form>
      {/* Action bar always visible at bottom */}
      <div className="px-6 pb-6 pt-3 border-t border-gray-100 bg-white flex gap-2 justify-end z-10">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2.5 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
          >
            Annuler
          </button>
        )}
        <button
          type="submit"
          form=""
          className="bg-blue-500 text-white px-6 py-2.5 rounded-md hover:bg-blue-600 transition-colors shadow-sm"
        >
          {type === "create" ? "Créer" : "Modifier"}
        </button>
      </div>
    </div>
  );
}

export default PartnerForm;