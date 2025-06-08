"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";

// Fonction de prétraitement améliorée
const preprocessNumber = (val: any) => {
  if (val === undefined || val === null || val === '') return null;
  if (typeof val === 'number') return val;
  
  const strVal = String(val).trim();
  if (strVal === '') return null;
  
  // Remplacer les virgules par des points et supprimer les espaces
  const processed = strVal.replace(/,/g, '.').replace(/\s/g, '');
  
  // Vérifier si c'est un nombre valide
  if (isNaN(Number(processed))) {
    return null;
  }
  
  return Number(processed);
};

// Schéma Zod avec validations minimales
const createSchema = z.object({
  nom_circuit: z.string().min(3, "Le nom doit comporter au moins 3 caractères"),
  description_thematique: z.string().min(10, "La description doit comporter au moins 10 caractères"),
  nbr_etape: z.preprocess(
    preprocessNumber, 
    z.number({ invalid_type_error: "Nombre d'étapes invalide" })
      .min(1, "Le nombre d'étapes doit être au moins 1")
  ),
  kilometrage: z.preprocess(
    preprocessNumber, 
    z.number({ invalid_type_error: "Kilométrage invalide" })
      .min(0.01, "Le kilométrage doit être positif")
  ),
  duree_heures: z.preprocess(
    preprocessNumber, 
    z.number({ invalid_type_error: "Durée en heures invalide" })
      .min(0, "La durée en heures doit être positive")
  ),
  duree_minutes: z.preprocess(
    preprocessNumber, 
    z.number({ invalid_type_error: "Durée en minutes invalide" })
      .min(0, "Les minutes doivent être positives")
  ),
  depart_longitude_circuit: z.preprocess(
    preprocessNumber, 
    z.number({ invalid_type_error: "Longitude invalide" })
  ),
  depart_latitude_circuit: z.preprocess(
    preprocessNumber, 
    z.number({ invalid_type_error: "Latitude invalide" })
  ),
  img: z.string().min(1, "L'image est requise"),
  video: z.string().optional(),
});

const updateSchema = createSchema;

type CreateInputs = z.infer<typeof createSchema>;
type UpdateInputs = z.infer<typeof updateSchema>;

const CircuitForm = ({
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
  } = useForm<CreateInputs | UpdateInputs>({
    resolver: zodResolver(type === "create" ? createSchema : updateSchema),
    defaultValues: type === "update" ? {
      nom_circuit: data?.nom_circuit || '',
      description_thematique: data?.description_thematique || '',
      nbr_etape: data?.nbr_etape || 1,
      kilometrage: data?.kilometrage || 0,
      duree_heures: data?.duree_heures || 0,
      duree_minutes: data?.duree_minutes || 0,
      depart_longitude_circuit: data?.depart_longitude_circuit || 0,
      depart_latitude_circuit: data?.depart_latitude_circuit || 0,
      img: data?.img || '',
      video: data?.video || '',
    } : undefined
  });

  const onSubmit = handleSubmit(async (formData) => {
    const token = localStorage.getItem("token");

    try {
      const url = type === "create" 
        ? "http://localhost:8000/circuit/create"
        : `http://localhost:8000/circuit/update/${data.id}`;

      // Préparation des données avec conversion des nombres
      const payload = {
        ...formData,
        nbr_etape: preprocessNumber(formData.nbr_etape),
        kilometrage: preprocessNumber(formData.kilometrage),
        duree_heures: preprocessNumber(formData.duree_heures),
        duree_minutes: preprocessNumber(formData.duree_minutes),
        depart_longitude_circuit: preprocessNumber(formData.depart_longitude_circuit),
        depart_latitude_circuit: preprocessNumber(formData.depart_latitude_circuit),
      };

      const response = await fetch(url, {
        method: type === "create" ? "POST" : "PATCH",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.message || "Erreur lors de l'opération");
      }

      onSuccess?.();
    } catch (error) {
      console.error("Erreur:", error);
    }
  });

  // Fonction pour gérer les changements des champs numériques
  const handleNumericChange = (e: React.ChangeEvent<HTMLInputElement>, name: keyof CreateInputs) => {
    const value = e.target.value.replace(/[^0-9,.-]/g, '');
    setValue(name, value as any);
  };

  return (
    <form className="flex flex-col gap-8 p-4" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Créer un nouveau circuit" : "Modifier le circuit"}
      </h1>      

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField
          label="Nom du circuit"
          name="nom_circuit"
          register={register}
          error={errors?.nom_circuit}
          className="w-full"
        />
        <InputField
          label="URL de l'image"
          name="img"
          register={register}
          error={errors?.img}
          className="w-full"
        />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <InputField
          label="Description thématique"
          name="description_thematique"
          type="textarea"
          register={register}
          error={errors?.description_thematique}
          className="w-full"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <InputField
          label="Nombre d'étapes"
          name="nbr_etape"
          type="text"
          inputMode="numeric"
          register={register}
          error={errors?.nbr_etape}
          className="w-full"
          onChange={(e) => handleNumericChange(e, 'nbr_etape')}
        />
        <InputField
          label="Kilométrage (km)"
          name="kilometrage"
          type="text"
          inputMode="decimal"
          register={register}
          error={errors?.kilometrage}
          className="w-full"
          onChange={(e) => handleNumericChange(e, 'kilometrage')}
        />
        <div className="flex gap-2">
          <InputField
            label="Durée (heures)"
            name="duree_heures"
            type="text"
            inputMode="decimal"
            register={register}
            error={errors?.duree_heures}
            className="w-full"
            onChange={(e) => handleNumericChange(e, 'duree_heures')}
          />
          <InputField
            label="Durée (minutes)"
            name="duree_minutes"
            type="text"
            inputMode="decimal"
            register={register}
            error={errors?.duree_minutes}
            className="w-full"
            onChange={(e) => handleNumericChange(e, 'duree_minutes')}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField
          label="Longitude de départ"
          name="depart_longitude_circuit"
          type="text"
          inputMode="decimal"
          register={register}
          error={errors?.depart_longitude_circuit}
          className="w-full"
          onChange={(e) => handleNumericChange(e, 'depart_longitude_circuit')}
        />
        <InputField
          label="Latitude de départ"
          name="depart_latitude_circuit"
          type="text"
          inputMode="decimal"
          register={register}
          error={errors?.depart_latitude_circuit}
          className="w-full"
          onChange={(e) => handleNumericChange(e, 'depart_latitude_circuit')}
        />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <InputField
          label="URL de la vidéo (optionnel)"
          name="video"
          register={register}
          error={errors?.video}
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

export default CircuitForm;