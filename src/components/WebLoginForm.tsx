"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";


export default function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const success = searchParams.get("success");

  const [showPassword, setShowPassword] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (success) {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  }, [success]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      console.log("Tentative de connexion avec:", { email, password });

      const response = await fetch("http://localhost:8000/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log("Réponse du serveur:", data);

      if (response.ok) {
        console.log("Token reçu:", data.token);
        localStorage.setItem("token", data.token);
        console.log("Token sauvegardé:", localStorage.getItem("token"));
        router.push("/admin");
      } else {
        setErrorMessage(data.message || "Identifiants incorrects.");
      }
    } catch (error) {
      console.error("Erreur complète:", error);
      setErrorMessage("Erreur de connexion. Vérifiez votre connexion réseau.");
    }
  };

  return (
    <main className="min-h-screen bg-white grid grid-cols-[1fr_auto_1fr] items-stretch overflow-hidden">
      {/* Message de succès */}
      {showSuccess && (
        <div className="absolute top-5 right-5 bg-green-500 text-white p-4 rounded-lg shadow-lg transition-opacity duration-500">
          Enregistrement réussi !
        </div>
      )}
      {/* Partie Gauche - Image */}
      <div className="relative border border-gray-300 backdrop-blur-sm shadow-lg rounded-r-[20px] overflow-hidden">
        <div className="w-full h-full relative">
          <Image
            src="/SigninImage.png"
            alt="Background Dourbia"
            layout="fill"
            objectFit="cover"
            className="w-full h-full"
          />
          <div className="absolute inset-0 bg-black/20 h-full p-8">
            {/* Logo placé exactement à (x: 164px, y: 221px) */}
            <div className="absolute left-[164px] top-[93px]">
              <Image
                src="/logo1.png"
                alt="Logo Dourbia"
                width={340}
                height={210}
              />
            </div>
            {/* h1 placé exactement à (x: 61px, y: 536px) */}
            <h1
              className="absolute left-[177px] top-[316px] text-[55px] font-extrabold text-white leading-[85px] font-['Inter']"
            >
              ACCÉDEZ À <br />
              <span>DOURBIA !</span>
            </h1>
          </div>
        </div>
      </div>
      <div className="w-20"></div>

      {/* Partie Droite - Formulaire */}
      <div className="relative flex justify-center items-center border border-gray-300 backdrop-blur-sm shadow-lg rounded-l-[20px] overflow-hidden">
        <div className="w-full max-w-md px-4 py-8 pt-8 pb-8 flex flex-col items-center">

          {/* Logo positionné en haut - top:15px */}
          <Image
            src="/logo4.png"
            alt="Logo Dourbia"
            width={90}
            height={80}
            className="absolute top-[15px]"
          />

          {/* Formulaire principal */}
          <form onSubmit={handleSubmit} className="w-full">

            {/* Input Email - top:168px */}
            <div className="absolute top-[168px] left-[105px]">
              <input
                type="email"
                placeholder="Adresse e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-[453px] h-[40px] bg-transparent border-none shadow-md rounded-[15px] px-4 py-2.5 focus:border-[#8F8F8F] outline-none text-sm placeholder:text-[#8F8F8F] placeholder:opacity-50 text-[#8F8F8F] opacity-50 leading-auto font-abeezee"
                required
              />
            </div>

            {/* Input Mot de passe - top:235px */}
            <div className="absolute top-[235px] left-[105px]">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-[453px] h-[40px] bg-transparent border-none shadow-md rounded-[15px] px-4 py-2.5 pr-10 focus:border-[#8F8F8F] outline-none text-sm placeholder:text-[#8F8F8F] placeholder:opacity-50 text-[#8F8F8F] opacity-50 font-abeezee leading-auto"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Checkbox Se rappeler - top:285px */}
            <div className="absolute top-[285px] left-[120px] flex items-center">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-[30px] w-[30.96px] border-2 border-[#C7C2C2] text-[#C7C2C2] focus:ring-0"
                id="remember"
              />
              <label htmlFor="remember" className="text-[12px] font-abeezee text-[#C7C2C2] ml-2">
                Se rappeler de moi ?
              </label>
            </div>

            {/* Bouton Se Connecter - top:320px */}
            <div className="absolute top-[329px] left-[230px]">
              <button
                type="submit"
                className="w-[200px] h-[37px] bg-[#5ED8F2] text-white rounded-[15px] py-3 text-l opacity-100 hover:bg-[#4AC0D8] font-abeezee flex justify-center items-center"
              >
                Se Connecter
              </button>
            </div>

            {/* Mot de passe oublié - top:370px */}
            <div className="absolute top-[385px] left-[105px] w-[453px] text-center">
              <Link href="/email-page" className="text-[16px] text-[#002863] font-abeezee underline">
                Mot de passe oublié ?
              </Link>
            </div>

            <div className="absolute top-[426px] left-1/2 transform -translate-x-1/2 w-[290px] flex items-center">
              <div className="flex-1 border-t border-[#707070] opacity-35"></div>
              <span className="px-3 text-[#B1B1B1] text-[10px] font-actor">OU</span>
              <div className="flex-1 border-t border-[#707070] opacity-35"></div>
            </div>


            {/* Boutons Sociaux */}
            <div className="absolute top-[475px] left-1/2 transform -translate-x-1/2 flex flex-col gap-6">
              <button
                type="button"
                className="w-[145px] h-[34px] bg-white border border-[#CCCCCC] rounded-[10px] flex items-center justify-start px-6 gap-x-3 font-montserrat-light text-[#000000] text-[13px] hover:bg-gray-50"
              >
                <FcGoogle size={20} className="flex-shrink-0" />
                Google
              </button>
              <button
                type="button"
                className="w-[145px] h-[34px] bg-white border border-[#CCCCCC] rounded-[10px] flex items-center justify-start px-6 gap-x-3 font-montserrat-light text-[#000000] text-[13px] hover:bg-gray-50"
              >
                <FaFacebook size={20} className="text-[#1877F2] flex-shrink-0" />
                Facebook
              </button>
            </div>



            {/* Créer un compte - top:550px */}
            <div className="absolute top-[605px] left-1/2 transform -translate-x-1/2 w-[453px] text-center">
              <p className="text-[#474747] text-[15px] font-montserrat-light mb-3">
                Vous n'êtes pas un membre?
              </p>
              <Link
                href="/sign-up"
                className="text-[#FB7822] font-montserrat-semibold text-[20px] underline underline-offset-4 hover:text-[#FB7822]"
              >
                Créer un compte
              </Link>
            </div>


          </form>
        </div>
      </div>
    </main>
  );
}