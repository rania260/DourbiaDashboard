// 'use client';
// import Link from 'next/link';
// import { useState, useEffect } from 'react';
// import { useRouter, useSearchParams } from 'next/navigation';

// const WebLoginForm = () => {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const success = searchParams.get('success');
//   const [showSuccess, setShowSuccess] = useState(false);
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [rememberMe, setRememberMe] = useState(false);
//   const [errorMessage, setErrorMessage] = useState('');

//   useEffect(() => {
//     if (success) {
//       setShowSuccess(true);
//       setTimeout(() => {
//         setShowSuccess(false);
//       }, 3000);
//     }
//   }, [success]);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setErrorMessage('');

//     try {
//       const response = await fetch('http://localhost:8000/auth/signin', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ email, password }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         localStorage.setItem('token', data.token); // Stocker le token

//         // Redirection vers l'admin s'il est admin (ajoute un check role si nécessaire)
//         router.push('/admin');
//       } else {
//         setErrorMessage(data.message || 'Identifiants incorrects.');
//       }
//     } catch (error) {
//       setErrorMessage('Erreur de connexion. Vérifiez votre connexion réseau.');
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       {showSuccess && (
//         <div className="absolute top-5 right-5 bg-green-500 text-white p-4 rounded-lg shadow-lg transition-opacity duration-500">
//            Enregistrement réussi !
//         </div>
//       )}

//       <div className="flex w-full max-w-4xl bg-white rounded-3xl shadow-lg overflow-hidden">
//         <div className="w-1/2 bg-white flex items-center justify-center p-8">
//           <img src="logo1.png" alt="Logo de l'application" className="max-w-[220px] w-full" />
//         </div>

//         <div className="w-1/2 bg-[#5ED8F2] flex items-center justify-center p-12 rounded-r-3xl">
//           <div className="w-full max-w-sm">
//             <form onSubmit={handleSubmit} className="space-y-4 text-center">
//               <input
//                 type="email"
//                 placeholder="Adresse e-mail"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-white bg-white placeholder-gray-400"
//                 required
//               />
//               <input
//                 type="password"
//                 placeholder="Mot de passe"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-white bg-white placeholder-gray-400"
//                 required
//               />
//               <div className="flex items-center justify-center text-white text-sm">
//                 <input
//                   type="checkbox"
//                   checked={rememberMe}
//                   onChange={(e) => setRememberMe(e.target.checked)}
//                   className="mr-2"
//                 />
//                 Se rappeler de moi ?
//               </div>
//               <button
//                 type="submit"
//                 className="w-full bg-white text-[#5ED8F2] font-bold py-3 rounded-lg shadow-lg hover:opacity-90 transition"
//               >
//                 Se Connecter
//               </button>
//               <a href="#" className="text-white block mt-2">Mot de passe oublié ?</a>
//             </form>

//             <div className="my-4 flex items-center">
//               <hr className="flex-1 border-white" />
//               <span className="px-4 text-white">ou</span>
//               <hr className="flex-1 border-white" />
//             </div>

//             <div className="text-center">
//               <p className="text-white">Vous n'êtes pas un membre ?</p>
//               <Link href="/sign-up" className="text-orange-500 font-bold">
//                 Créer un compte
//               </Link>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default WebLoginForm;
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main className="min-h-screen bg-white grid grid-cols-[1fr_auto_1fr] items-stretch overflow-hidden">
      {/* Partie Gauche - Image */}
      <div className="relative border border-gray-300 backdrop-blur-sm shadow-lg rounded-r-lg overflow-hidden">
        <div className="w-full h-full relative">
          <Image
            src="/SigninImage.png"
            alt="Background Dourbia"
            layout="fill"
            objectFit="cover"
            className="rounded-l-lg"
          />
          <div className="absolute inset-0 bg-black/20 flex flex-col items-center h-full p-8">
            {/* Logo en haut */}
            <div className="w-full flex justify-center pt-12">
              <Image
                src="/logo1.png"
                alt="Logo Dourbia"
                width={360}
                height={180}
                className="mx-auto"
              />
            </div>
            {/* Titre positionné au centre vertical */}
            <div className="flex-grow flex items-center justify-center">
              <h1 className="text-5xl font-black text-white text-center mt-[-20%]">
                ACCÉDEZ À <br />
                <span>DOURBIA</span>
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Espace entre les deux bordures */}
      <div className="w-16"></div>

      {/* Partie Droite - Formulaire */}
      <div className="flex justify-center items-center border border-gray-300 backdrop-blur-sm shadow-lg rounded-l-lg">
        <div className="w-full max-w-md px-4 py-8 pt-8 pb-8">
          <Image src="/logo4.png" alt="Logo Dourbia" width={90} height={45} className="mx-auto mb-4" />
          <h2 className="text-center text-xl text-[#60D8F4] mb-6">Se connecter</h2>
          <form className="space-y-4">
            <div className="relative">
              <input
                type="email"
                placeholder="Adresse e-mail"
                className="w-full max-w-lg h-[46px] bg-transparent border-none shadow-[0_4px_8px_rgba(143,143,143,0.2)] rounded-md px-4 py-2.5 focus:border-[#FB7822] outline-none text-sm"
              />
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Mot de passe"
                className="w-full max-w-lg h-[46px] bg-transparent border-none shadow-[0_4px_8px_rgba(143,143,143,0.2)] rounded-md px-4 py-2.5 pr-10 focus:border-[#FB7822] outline-none text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input type="checkbox" className="h-4 w-4 text-[#FA7921]" id="remember" />
                <label htmlFor="remember" className="text-xs text-gray-500 ml-2">
                  Se rappeler de moi
                </label>
              </div>
              <Link href="/email-page" className="text-xs text-[#FA7921] hover:underline">Mot de passe oublié ?</Link>
            </div>
            <div className="flex flex-col justify-center items-center mx-auto space-y-4">
              <button
                type="submit"
                className="w-[256px] h-[51px] rounded-full bg-[#5ED8F2] py-3 font-medium text-white hover:bg-[#4AC0D8] text-sm"
              >
                Se connecter
              </button>
            </div>
            <p className="mt-4 text-center text-xs text-gray-500">
              <Link href="/sign-up" className="text-[#002863] hover:underline">Vous n'avez pas de compte ?</Link>
            </p>
          </form>
        </div>
      </div>
    </main>
  );
}