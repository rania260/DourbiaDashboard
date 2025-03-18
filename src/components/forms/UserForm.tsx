import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";

const schema = z.object({
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

const UserForm = ({
  type,
  data,
}: {
  type: "create" | "update";
  data?: any;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onSubmit = handleSubmit(async (formData) => {
    setIsLoading(true);
    setErrorMessage(null);
  
    const form = new FormData();
    form.append("username", formData.username);
    form.append("email", formData.email);
    form.append("password", formData.password);
    form.append("phone", formData.phone);
    form.append("country", formData.country);
    form.append("role", formData.role);
    form.append("region", formData.region); 
  
    try {
      const response = await fetch("http://localhost:8000/auth/create", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
        },
        credentials: 'include',  
      });
  
      if (!response.ok) {
        throw new Error("Erreur lors de la création de l'utilisateur");
      }
  
      const result = await response.json();
      console.log("Utilisateur créé avec succès", result);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrorMessage(error.message || "Une erreur est survenue");
      } else {
        setErrorMessage("Une erreur est survenue");
      }
    } finally {
      setIsLoading(false);
    }
  });

  return (
    <form className="flex flex-col gap-4 p-6 bg-white rounded-lg shadow-lg" onSubmit={onSubmit}>
      <h1 className="text-2xl font-semibold text-center text-blue-500">
        {type === "create" ? "Créer un nouvel utilisateur" : "Mettre à jour l'utilisateur"}
      </h1>

      {/* Nom d'utilisateur */}
      <div>
        <label htmlFor="username" className="text-sm font-medium text-gray-700">Nom d'utilisateur</label>
        <input
          id="username"
          type="text"
          {...register("username")}
          placeholder="Nom d'utilisateur"
          className="mt-2 p-3 border border-gray-300 rounded-md w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.username && <p className="text-red-500 text-xs">{errors.username.message}</p>}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
        <input
          id="email"
          type="email"
          {...register("email")}
          placeholder="Email"
          className="mt-2 p-3 border border-gray-300 rounded-md w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
      </div>

      {/* Mot de passe */}
      <div>
        <label htmlFor="password" className="text-sm font-medium text-gray-700">Mot de passe</label>
        <input
          id="password"
          type="password"
          {...register("password")}
          placeholder="Mot de passe"
          className="mt-2 p-3 border border-gray-300 rounded-md w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
      </div>

      {/* Téléphone */}
      <div>
        <label htmlFor="phone" className="text-sm font-medium text-gray-700">Téléphone</label>
        <input
          id="phone"
          type="text"
          {...register("phone")}
          placeholder="Téléphone"
          className="mt-2 p-3 border border-gray-300 rounded-md w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.phone && <p className="text-red-500 text-xs">{errors.phone.message}</p>}
      </div>

      {/* Pays */}
      <div>
        <label htmlFor="country" className="text-sm font-medium text-gray-700">Pays</label>
        <input
          id="country"
          type="text"
          {...register("country")}
          placeholder="Pays"
          className="mt-2 p-3 border border-gray-300 rounded-md w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.country && <p className="text-red-500 text-xs">{errors.country.message}</p>}
      </div>

      {/* Région */}
      <div>
        <label htmlFor="region" className="text-sm font-medium text-gray-700">Région</label>
        <input
          id="region"
          type="text"
          {...register("region")}
          placeholder="Région"
          className="mt-2 p-3 border border-gray-300 rounded-md w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.region && <p className="text-red-500 text-xs">{errors.region.message}</p>}
      </div>

      {/* Rôle */}
      <div>
        <label htmlFor="role" className="text-sm font-medium text-gray-700">Rôle</label>
        <select
          id="role"
          {...register("role")}
          className="mt-2 p-3 border border-gray-300 rounded-md w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Sélectionner un rôle</option>
          <option value="user">Utilisateur</option>
          <option value="admin">Administrateur</option>
          <option value="expert">Expert</option>
          <option value="partenaire">Partenaire</option>
        </select>
        {errors.role && <p className="text-red-500 text-xs">{errors.role.message}</p>}
      </div>

      {errorMessage && <p className="text-red-500 text-xs text-center">{errorMessage}</p>}

      <button
        className="bg-blue-500 text-white p-3 rounded-md mt-4"
        disabled={isLoading}
      >
        {isLoading ? "Création en cours..." : type === "create" ? "Créer" : "Mettre à jour"}
      </button>
    </form>
  );
};

export default UserForm;
