"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import Select from "react-select";

// Dans le schéma Zod
const createSchema = z.object({
  service: z.string().min(3, "Le nom du service est requis"),
  type: z.string().min(3, "Le type est requis"),
  description: z.string().optional(),
  regions: z.array(z.string()).min(1, "Sélectionnez au moins une région"),
  prix: z
  .string()
  .refine((val) => !isNaN(Number(val)), {
    message: "Le prix doit être un nombre valide",
  })
  .transform((val) => Number(val))
  .pipe(
    z.number().min(0, "Le prix doit être supérieur ou égal à 0")
  )
});


const updateSchema = createSchema.partial();

type CreateInputs = z.infer<typeof createSchema>;
type UpdateInputs = z.infer<typeof updateSchema>;

const ServiceForm = ({
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
    defaultValues: type === "update" ? data : {}
  });

  const onSubmit = handleSubmit(async (formData) => {
    const token = localStorage.getItem("token");

    try {
      const url = type === "create"
        ? "http://localhost:8000/services/add"
        : `http://localhost:8000/services/update/${data.id}`;

      const response = await fetch(url, {
        method: type === "create" ? "POST" : "PATCH",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.message || "Erreur lors de l'opération");
      }

      onSuccess && onSuccess();
    } catch (error) {
      console.error("Erreur:", error);
    }
  });

  const regionOptions = [
    { value: "Tunis", label: "Tunis" },
    { value: "Sousse", label: "Sousse" },
    { value: "Sfax", label: "Sfax" },
    { value: "Djerba", label: "Djerba" },
  ];

  return (
    <div className="flex flex-col h-full max-h-[90vh] bg-white relative">
      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          className="absolute top-3 right-4 text-gray-400 hover:text-gray-700 text-2xl font-bold z-20"
        >×</button>
      )}
      <div className="px-6 pt-6 pb-2 border-b border-gray-100">
        <h1 className="text-xl font-semibold">
          {type === "create" ? "Ajouter un service" : "Modifier le service"}
        </h1>
      </div>
      <form className="flex-1 flex flex-col gap-8 px-6 py-4 overflow-y-auto" onSubmit={onSubmit}>
        <InputField label="Nom du Service*" name="service" register={register} error={errors?.service} />
        <InputField label="Type*" name="type" register={register} error={errors?.type} />
        <InputField label="Description" name="description" register={register} error={errors?.description} />
        <div>
          <label>Régions couvertes*</label>
          <Select
            isMulti
            options={regionOptions}
            className="react-select-container"
            value={regionOptions.filter(opt => (watch("regions") || []).includes(opt.value))}
            onChange={selected => setValue("regions", selected.map((opt: any) => opt.value))}
          />
          {errors?.regions && <p className="text-red-600 text-sm">{errors.regions.message}</p>}
        </div>
        <InputField label="Prix*" name="prix" type="number" register={register} error={errors?.prix} />
      </form>
      <div className="px-6 pb-6 pt-3 border-t border-gray-100 flex justify-end">
        {onCancel && (
          <button onClick={onCancel} className="px-4 py-2 border rounded">Annuler</button>
        )}
        <button
          type="submit"
          className="bg-blue-500 text-white px-6 py-2 ml-2 rounded"
        >
          {type === "create" ? "Créer" : "Modifier"}
        </button>

      </div>
    </div>
  );
};

export default ServiceForm;