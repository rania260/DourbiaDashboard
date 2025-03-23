"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SignUpForm() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [country, setCountry] = useState("");
  const [region, setRegion] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Les mots de passe ne correspondent pas");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: fullName,
          email,
          password,
          country,
          region,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        router.push("/sign-up/verification");
      } else {
        alert(data.message || "Erreur lors de l'inscription");
      }
    } catch (error) {
      console.error("Erreur complète:", error);
      alert("Problème de connexion avec le serveur");
    }
  };

  return (
    <main className="min-h-screen bg-white grid grid-cols-[1fr_auto_1fr] items-stretch overflow-hidden">
      {/* Partie Gauche - Image */}
      <div className="relative border border-gray-300 backdrop-blur-sm shadow-lg rounded-r-[20px] overflow-hidden">
        <div className="w-full h-full relative">
          <Image
            src="/SignupImage.png"
            alt="Background Dourbia"
            layout="fill"
            objectFit="cover"
            className="w-full h-full"
          />
          <div className="absolute inset-0 bg-black/20 h-full p-8">
            <div className="absolute left-[164px] top-[93px]">
              <Image
                src="/logo1.png"
                alt="Logo Dourbia"
                width={340}
                height={210}
              />
            </div>
            <h1 className="absolute left-[177px] top-[380px] text-[55px] font-extrabold text-white leading-[85px]">
              BIENVENUE À <br />
              <span>DOURBIA</span>
            </h1>
          </div>
        </div>
      </div>
      <div className="w-20"></div>

      {/* Partie Droite - Formulaire */}
      <div className="relative flex justify-center items-center border border-gray-300 backdrop-blur-sm shadow-lg rounded-l-[20px] overflow-hidden">
        <div className="w-full max-w-md px-4 py-8 pt-8 pb-8 flex flex-col items-center">
          <Image
            src="/logo3.png"
            alt="Logo Dourbia"
            width={90}
            height={80}
            className="absolute top-[15px]"
          />

          <h2 className="relative top-4 text-[20px] text-[#60D8F4] mb-5 mt-10 font-actor text-center">
            Créer un compte
          </h2>


          <form onSubmit={handleSubmit} className="w-full space-y-1">
            <div className="space-y-3">
              {/* Champ Nom complet */}
              <div className="relative">
                <input
                  type="text"
                  placeholder=""
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-[453px] h-[40px] bg-transparent border-none shadow-md rounded-[15px] px-4 py-2.5 focus:border-[#8F8F8F] outline-none text-sm placeholder:text-[#8F8F8F] placeholder:opacity-50 text-[#8F8F8F] opacity-50 font-abeezee leading-auto"
                  required
                />
                {!fullName && (
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none flex items-center">
                    <span className="text-[#8F8F8F] text-sm placeholder:text-[#8F8F8F] placeholder:opacity-50 text-[#8F8F8F] opacity-50 font-abeezee leading-auto">Nom et prénom</span>
                    <span className="text-[#FB7822] ml-1">*</span>
                  </div>
                )}
              </div>

              {/* Champ Email */}
              <div className="relative">
                <input
                  type="email"
                  placeholder=""
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-[453px] h-[40px] bg-transparent border-none shadow-md rounded-[15px] px-4 py-2.5 focus:border-[#8F8F8F] outline-none text-sm text-[#8F8F8F] opacity-50 font-abeezee leading-auto"
                  required
                />
                {!email && (
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none flex items-center">
                    <span className="text-[#8F8F8F] text-sm opacity-50 font-abeezee">Adresse e-mail</span>
                    <span className="text-[#FB7822] ml-1">*</span>
                  </div>
                )}
              </div>

              {/* Champ Mot de passe */}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder=""
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-[453px] h-[40px] bg-transparent border-none shadow-md rounded-[15px] px-4 py-2.5 pr-10 focus:border-[#8F8F8F] outline-none text-sm text-[#8F8F8F] opacity-50 font-abeezee leading-auto"
                  required
                />
                {!password && (
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none flex items-center">
                    <span className="text-[#8F8F8F] text-sm opacity-50 font-abeezee">Mot de passe</span>
                    <span className="text-[#FB7822] ml-1">*</span>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Champ Confirmation Mot de passe */}
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder=""
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-[453px] h-[40px] bg-transparent border-none shadow-md rounded-[15px] px-4 py-2.5 pr-10 focus:border-[#8F8F8F] outline-none text-sm text-[#8F8F8F] opacity-50 font-abeezee leading-auto"
                  required
                />
                {!confirmPassword && (
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none flex items-center">
                    <span className="text-[#8F8F8F] text-sm opacity-50 font-abeezee">Confirmer mot de passe</span>
                    <span className="text-[#FB7822] ml-1">*</span>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Champ Pays */}
              <div className="relative">
                <input
                  type="text"
                  placeholder=""
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-[453px] h-[40px] bg-transparent border-none shadow-md rounded-[15px] px-4 py-2.5 focus:border-[#8F8F8F] outline-none text-sm text-[#8F8F8F] opacity-50 font-abeezee leading-auto"
                  required
                />
                {!country && (
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none flex items-center">
                    <span className="text-[#8F8F8F] text-sm opacity-50 font-abeezee">Pays</span>

                  </div>
                )}
              </div>

              {/* Champ Région */}
              <div className="relative mb-[20px]"> {/* Ajout d'un margin-bottom pour l'espacement */}
                <input
                  type="text"
                  placeholder=""
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-[453px] h-[40px] bg-transparent border-none shadow-md rounded-[15px] px-4 py-2.5 
      focus:border-[#8F8F8F] outline-none text-sm text-[#8F8F8F] opacity-50 font-abeezee leading-auto"
                  required
                />
                {!region && (
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none flex items-center">
                    <span className="text-[#8F8F8F] text-sm opacity-50 font-abeezee">Région</span>
                  </div>
                )}
              </div>

              {/* Checkbox Conditions */}
              <div className="flex items-center gap-2 mt-[60px] ml-[40px]">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    className="opacity-0 absolute peer"
                    id="terms"
                    required
                  />
                  <div className="h-[25px] w-[25px] border-[1px] border-[#777272] rounded-md 
      peer-checked:bg-[#E0E0E0] peer-checked:border-[#E0E0E0] transition-colors duration-200 flex items-center justify-center">
                    {/* Checkmark icon (gris) */}
                    <svg
                      className="hidden peer-checked:block text-[#777272] w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                </div>
                <label htmlFor="terms" className="text-[15px] font-actor text-[#777272] leading-[1.5] mt-[-10px]">
                  J'accepte les{" "}
                  <Link href="#" className="text-[#FB7822] underline underline-offset-4">
                    conditions d'utilisation
                  </Link>{" "}
                  de Dourbia
                </label>
              </div>
            </div>


            {/* Bouton d'inscription */}
            <div className="flex flex-col justify-center items-center mx-auto mt-12">
              <button
                type="submit"
                className="w-[200px] h-[37px] bg-[#5ED8F2] text-white rounded-[15px] py-3 text-m opacity-100 hover:bg-[#4AC0D8] font-actor flex justify-center items-center"
              >
                S'inscrire
              </button>
            </div>

            {/* Lien de connexion */}
            <div className="flex justify-center mt-13">
              <Link
                href="/sign-in"
                className="text-[#002863] underline text-[17px] font-montserrat-light underline-offset-3"
              >
                Vous avez déjà un compte?
              </Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}