"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";

// Schéma de validation avec tous les champs
const createSchema = z.object({
  nom_monument_FR: z.string().min(3, "Le nom français doit comporter au moins 3 caractères"),
  nom_monument_EN: z.string().optional(),
  nom_monument_AR: z.string().optional(),
  priorité: z.number().min(1, "La priorité doit être au moins 1").max(5, "La priorité maximale est 5").optional(),
  latitude_monument: z.string().regex(/^-?\d+\.\d+$/, "Format de latitude invalide").optional(),
  longitude_monument: z.string().regex(/^-?\d+\.\d+$/, "Format de longitude invalide").optional(),
  statut_monument: z.string().optional(),
  importance_monument: z.string().optional(),
  accessibilite_monument: z.string().optional(),
  relief: z.string().optional(),
  adresse_monument: z.string().optional(),
  description_FR: z.string().min(10, "La description doit comporter au moins 10 caractères").optional(),
  description_EN: z.string().optional(),
  description_AR: z.string().optional(),
  Affect: z.string().optional(),
  etat_conservation: z.string().optional(),
  duree_visite: z.number().min(0, "La durée ne peut pas être négative").optional(),
  horaire_ouverture_ete: z.string().optional(),
  horaire_fermeture_ete: z.string().optional(),
  horaire_ouverture_hiver: z.string().optional(),
  horaire_fermeture_hiver: z.string().optional(),
  telephone_site: z.string().optional(),
  epoque_dominante: z.string().optional(),
  epoque_moins_visible: z.string().optional(),
  troisieme_epoque: z.string().optional(),
  fonction_monument: z.string().optional(),
  image_panoramique: z.string().url("URL invalide").or(z.literal("")).optional(),
  modele_obj: z.string().optional(),
  url_video_FR: z.string().url("URL invalide").or(z.literal("")).optional(),
  uri_video_EN: z.string().url("URL invalide").or(z.literal("")).optional(),
  uri_video_AR: z.string().url("URL invalide").or(z.literal("")).optional(),
  lien_video_360: z.string().url("URL invalide").or(z.literal("")).optional(),
  lien_video_3D: z.string().url("URL invalide").or(z.literal("")).optional(),
  enregistrement_audio_FR: z.string().optional(),
  enregistrement_audio_EN: z.string().optional(),
  enregistrement_audio_AR: z.string().optional(),
});

const updateSchema = createSchema;

type CreateInputs = z.infer<typeof createSchema>;
type UpdateInputs = z.infer<typeof updateSchema>;

const MonumentForm = ({
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
  } = useForm({
    resolver: zodResolver(type === "create" ? createSchema : updateSchema),
    defaultValues: type === "update" ? {
      ...data
    } : {
      priorité: 1,
      duree_visite: 0,
    }
  });

  const onSubmit = handleSubmit(async (formData) => {
    const token = localStorage.getItem("token");
    
    try {
      const url = type === "create" 
        ? "http://localhost:8000/monument/create"
        : `http://localhost:8000/monument/update/${data.id}`;

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

  // Options pour les select
  const statutOptions = [
    { value: "ouvert", label: "Ouvert" },
    { value: "fermé", label: "Fermé" },
    { value: "en travaux", label: "En travaux" },
  ];

  const importanceOptions = [
    { value: "haute", label: "Haute" },
    { value: "moyenne", label: "Moyenne" },
    { value: "basse", label: "Basse" },
  ];

  const accessibiliteOptions = [
    { value: "accessible", label: "Accessible" },
    { value: "partiellement accessible", label: "Partiellement accessible" },
    { value: "non accessible", label: "Non accessible" },
  ];

  const etatOptions = [
    { value: "excellent", label: "Excellent" },
    { value: "bon", label: "Bon" },
    { value: "moyen", label: "Moyen" },
    { value: "mauvais", label: "Mauvais" },
    { value: "critique", label: "Critique" },
  ];

  const affectOptions = [
    { value: "culturel", label: "Culturel" },
    { value: "historique", label: "Historique" },
    { value: "religieux", label: "Religieux" },
    { value: "architectural", label: "Architectural" },
  ];

  return (
    <form className="flex flex-col gap-8 p-4" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Ajouter un nouveau monument" : "Modifier le monument"}
      </h1>      
      
      {/* Section 1: Noms */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <InputField
          label="Nom (FR)*"
          name="nom_monument_FR"
          register={register}
          error={errors?.nom_monument_FR}
          className="w-full"
        />
        <InputField
          label="Nom (EN)"
          name="nom_monument_EN"
          register={register}
          error={errors?.nom_monument_EN}
          className="w-full"
        />
        <InputField
          label="Nom (AR)"
          name="nom_monument_AR"
          register={register}
          error={errors?.nom_monument_AR}
          className="w-full"
        />
      </div>

      {/* Section 2: Localisation */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <InputField
          label="Priorité (1-5)"
          name="priorité"
          type="number"
          register={register}
          error={errors?.priorité}
          className="w-full"
          onChange={(e) => setValue("priorité", parseInt(e.target.value))}
        />
        <InputField
          label="Latitude"
          name="latitude_monument"
          register={register}
          error={errors?.latitude_monument}
          className="w-full"
        />
        <InputField
          label="Longitude"
          name="longitude_monument"
          register={register}
          error={errors?.longitude_monument}
          className="w-full"
        />
        <InputField
          label="Relief"
          name="relief"
          register={register}
          error={errors?.relief}
          className="w-full"
        />
      </div>

      {/* Section 3: Caractéristiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <InputField
          label="Statut"
          name="statut_monument"
          register={register}
          error={errors?.statut_monument}
          options={statutOptions}
          className="w-full"
        />
        <InputField
          label="Importance"
          name="importance_monument"
          register={register}
          error={errors?.importance_monument}
          options={importanceOptions}
          className="w-full"
        />
        <InputField
          label="Accessibilité"
          name="accessibilite_monument"
          register={register}
          error={errors?.accessibilite_monument}
          options={accessibiliteOptions}
          className="w-full"
        />
        <InputField
          label="Affect"
          name="Affect"
          register={register}
          error={errors?.Affect}
          options={affectOptions}
          className="w-full"
        />
      </div>

      {/* Section 4: Adresse et descriptions */}
      <div className="grid grid-cols-1 gap-6">
        <InputField
          label="Adresse"
          name="adresse_monument"
          register={register}
          error={errors?.adresse_monument}
          className="w-full"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <InputField
          label="Description (FR)"
          name="description_FR"
          type="textarea"
          register={register}
          error={errors?.description_FR}
          className="w-full"
        />
        <InputField
          label="Description (EN)"
          name="description_EN"
          type="textarea"
          register={register}
          error={errors?.description_EN}
          className="w-full"
        />
        <InputField
          label="Description (AR)"
          name="description_AR"
          type="textarea"
          register={register}
          error={errors?.description_AR}
          className="w-full"
        />
      </div>

      {/* Section 5: État et visite */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <InputField
          label="État de conservation"
          name="etat_conservation"
          register={register}
          error={errors?.etat_conservation}
          options={etatOptions}
          className="w-full"
        />
        <InputField
          label="Durée de visite (minutes)"
          name="duree_visite"
          type="number"
          register={register}
          error={errors?.duree_visite}
          className="w-full"
          onChange={(e) => setValue("duree_visite", parseInt(e.target.value))}
        />
        <InputField
          label="Téléphone"
          name="telephone_site"
          register={register}
          error={errors?.telephone_site}
          className="w-full"
        />
        <InputField
          label="Fonction du monument"
          name="fonction_monument"
          register={register}
          error={errors?.fonction_monument}
          className="w-full"
        />
      </div>

      {/* Section 6: Horaires */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <InputField
          label="Ouverture été"
          name="horaire_ouverture_ete"
          register={register}
          error={errors?.horaire_ouverture_ete}
          className="w-full"
        />
        <InputField
          label="Fermeture été"
          name="horaire_fermeture_ete"
          register={register}
          error={errors?.horaire_fermeture_ete}
          className="w-full"
        />
        <InputField
          label="Ouverture hiver"
          name="horaire_ouverture_hiver"
          register={register}
          error={errors?.horaire_ouverture_hiver}
          className="w-full"
        />
        <InputField
          label="Fermeture hiver"
          name="horaire_fermeture_hiver"
          register={register}
          error={errors?.horaire_fermeture_hiver}
          className="w-full"
        />
      </div>

      {/* Section 7: Époques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <InputField
          label="Époque dominante"
          name="epoque_dominante"
          register={register}
          error={errors?.epoque_dominante}
          className="w-full"
        />
        <InputField
          label="Époque moins visible"
          name="epoque_moins_visible"
          register={register}
          error={errors?.epoque_moins_visible}
          className="w-full"
        />
        <InputField
          label="Troisième époque"
          name="troisieme_epoque"
          register={register}
          error={errors?.troisieme_epoque}
          className="w-full"
        />
      </div>

      {/* Section 8: Médias */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField
          label="Image panoramique (URL)"
          name="image_panoramique"
          register={register}
          error={errors?.image_panoramique}
          className="w-full"
        />
        <InputField
          label="Modèle 3D (URL)"
          name="modele_obj"
          register={register}
          error={errors?.modele_obj}
          className="w-full"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <InputField
          label="Vidéo FR (URL)"
          name="url_video_FR"
          register={register}
          error={errors?.url_video_FR}
          className="w-full"
        />
        <InputField
          label="Vidéo EN (URL)"
          name="uri_video_EN"
          register={register}
          error={errors?.uri_video_EN}
          className="w-full"
        />
        <InputField
          label="Vidéo AR (URL)"
          name="uri_video_AR"
          register={register}
          error={errors?.uri_video_AR}
          className="w-full"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField
          label="Vidéo 360 (URL)"
          name="lien_video_360"
          register={register}
          error={errors?.lien_video_360}
          className="w-full"
        />
        <InputField
          label="Vidéo 3D (URL)"
          name="lien_video_3D"
          register={register}
          error={errors?.lien_video_3D}
          className="w-full"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <InputField
          label="Audio FR (URL)"
          name="enregistrement_audio_FR"
          register={register}
          error={errors?.enregistrement_audio_FR}
          className="w-full"
        />
        <InputField
          label="Audio EN (URL)"
          name="enregistrement_audio_EN"
          register={register}
          error={errors?.enregistrement_audio_EN}
          className="w-full"
        />
        <InputField
          label="Audio AR (URL)"
          name="enregistrement_audio_AR"
          register={register}
          error={errors?.enregistrement_audio_AR}
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

export default MonumentForm;