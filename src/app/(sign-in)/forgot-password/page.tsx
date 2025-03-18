'use client';
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const Password = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="flex justify-center items-center min-h-screen">
      {/* Cadre principal avec bordure similaire */}
      <div
        className="bg-white rounded-xl shadow-lg flex flex-col items-center backdrop-blur-sm border border-gray-300"
        style={{
          width: '527px',
          height: '706px',
          padding: '20px 40px'
        }}
      >
        {/* Logo */}
        <img
          src="/logo4.png" width={90} height={45} className="mx-auto mb-17"
        />

        {/* Titre */}
        <h1 className="text-2xl mb-14 text-[#FB7822] style={{ fontFamily: 'ABeeZee' }}">
          Réinitialiser le mot de passe
        </h1>

        {/* Inputs */}
        <div className="relative w-full max-w-lg mb-22">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Nouveau mot de passe *"
            className="w-full h-[46px] rounded-md px-4 py-2.5 border border-[#5ED8F2] outline-none text-sm pr-10"
          />
          {/* Icône pour afficher/masquer */}
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showConfirmPassword ? (
              <EyeOff size={20} className="text-[#5ED8F2]" />
            ) : (
              <Eye size={20} className="text-[#5ED8F2]" />
            )}
          </button>
        </div>

        <div className="relative w-full max-w-lg mt-4 mb-17">
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirmer Nouveau mot de passe*"
            className="w-full h-[46px] rounded-md px-4 py-2.5 border border-[#5ED8F2] outline-none text-sm pr-10"
          />
          {/* Icône pour afficher/masquer */}
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? (
              <EyeOff size={20} className="text-[#5ED8F2]" />
            ) : (
              <Eye size={20} className="text-[#5ED8F2]" />
            )}
          </button>
        </div>
        {/* Bouton Confirmer */}
        <button
          className="w-[200px] h-[41px] rounded-full bg-[#FB7822] py-3 font-medium text-white text-sm"
        >
          Confirmer
        </button>
      </div>
    </div>
  );
};



export default Password;
