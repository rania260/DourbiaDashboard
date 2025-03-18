// 'use client';

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';

// const SignUpForm = () => {
//   const router = useRouter();
//   const [FullName, setFullName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [acceptedTerms, setAcceptedTerms] = useState(false);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (password !== confirmPassword) {
//       alert('Les mots de passe ne correspondent pas');
//       return;
//     }

//     try {
//       const response = await fetch('http://localhost:8000/auth/signup', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           username: FullName,
//           email: email,
//           password: password,
//         }),
//         mode: 'cors',
//         credentials: 'include'
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         alert(errorData.message || "Erreur lors de l'inscription");
//         return;
//       }

//       // Redirection vers la page de connexion avec paramètre de succès
//       router.push('/sign-in?success=1');

//     } catch (error) {
//       console.error('Erreur lors de la requête :', error);
//       alert('Problème de connexion avec le serveur');
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <div className="flex w-full max-w-5xl bg-white rounded-3xl shadow-lg overflow-hidden">
//         <div className="w-1/2 bg-white flex items-center justify-center p-8">
//           <img 
//             src="logo1.png" 
//             alt="Logo de l'application"
//             className="max-w-[220px] w-full"
//           />
//         </div>

//         <div className="w-1/2 bg-[#5ED8F2] flex items-center justify-center p-14 rounded-r-3xl">
//           <div className="w-full max-w-md">
//             <form onSubmit={handleSubmit} className="space-y-6 text-center">
//               <div className="relative">
//                 <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-orange-500">*</span>
//                 <input
//                   type="text"
//                   placeholder="Nom et prénom"
//                   value={FullName}
//                   onChange={(e) => setFullName(e.target.value)}
//                   className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-white bg-white placeholder-gray-400 pl-6"
//                   required
//                 />
//               </div>
//               <div className="relative">
//                 <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-orange-500">*</span>
//                 <input
//                   type="email"
//                   placeholder="Adresse e-mail"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-white bg-white placeholder-gray-400 pl-6"
//                   required
//                 />
//               </div>
//               <div className="relative">
//                 <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-orange-500">*</span>
//                 <input
//                   type="password"
//                   placeholder="Mot de passe"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-white bg-white placeholder-gray-400 pl-6"
//                   required
//                 />
//               </div>
//               <div className="relative">
//                 <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-orange-500">*</span>
//                 <input
//                   type="password"
//                   placeholder="Confirmer le mot de passe"
//                   value={confirmPassword}
//                   onChange={(e) => setConfirmPassword(e.target.value)}
//                   className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-white bg-white placeholder-gray-400 pl-6"
//                   required
//                 />
//               </div>
//               <div className="flex items-center justify-center text-white text-sm">
//                 <input
//                   type="checkbox"
//                   checked={acceptedTerms}
//                   onChange={(e) => setAcceptedTerms(e.target.checked)}
//                   className="mr-2"
//                   required
//                 />
//                 <a href="#" className="text-[#FB7822]">J'accepte les conditions de Dourbia</a>
//               </div>
//               <button
//                 type="submit"
//                 className="w-full bg-white text-[#5ED8F2] font-bold py-3 rounded-lg shadow-lg hover:opacity-90 transition"
//               >
//                 S'inscrire
//               </button>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SignUpForm;


"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <main className="min-h-screen bg-white grid grid-cols-[1fr_auto_1fr] items-stretch overflow-hidden">
      {/* Partie Gauche - Image */}
      <div className="relative border border-gray-300 backdrop-blur-sm shadow-lg rounded-r-lg overflow-hidden">
        <div className="w-full h-full relative">
          <Image
            src="/SignupImage.png"
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
                width={360}  // Adjust the width for the logo
                height={180} // Adjust the height for the logo
                className="mx-auto"
              />
            </div>

            {/* Titre positionné au centre vertical */}
            <div className="flex-grow flex items-center justify-center">
              <h1 className="text-5xl font-black text-white text-center mt-[-20%]">
                BIENVENUE À <br />
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
        <Image src="/logo3.png" alt="Logo Dourbia" width={90} height={45} className="mx-auto mb-4" />
          <h2 className="text-center text-xl text-[#60D8F4] mb-6">Créer un compte</h2>
          <form className="space-y-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Nom et prénom"
                className="w-full max-w-lg h-[46px] bg-transparent border-none shadow-[0_4px_8px_rgba(143,143,143,0.2)] rounded-md px-4 py-2.5 focus:border-[#FB7822] outline-none text-sm"
              />
            </div>
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
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirmer mot de passe"
                className="w-full max-w-lg h-[46px] bg-transparent border-none shadow-[0_4px_8px_rgba(143,143,143,0.2)] rounded-md px-4 py-2.5 pr-10 focus:border-[#FB7822] outline-none text-sm"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <input
              type="text"
              placeholder="Pays"
              className="w-full max-w-lg h-[46px] bg-transparent border-none shadow-[0_4px_8px_rgba(143,143,143,0.2)] rounded-md px-4 py-2.5 focus:border-[#FB7822] outline-none text-sm"
            />
            <input
              type="text"
              placeholder="Région"
              className="w-full max-w-lg h-[46px] bg-transparent border-none shadow-[0_4px_8px_rgba(143,143,143,0.2)] rounded-md px-4 py-2.5 focus:border-[#FB7822] outline-none text-sm"
            />
            <div className="flex flex-col justify-center items-center mx-auto space-y-4">
              <div className="flex justify-center items-center w-[514.99px] h-[35px]">
                <input type="checkbox" className="h-4 w-4 text-[#FA7921]" id="terms" />
                <label htmlFor="terms" className="text-xs text-gray-500">
                  J'accepte les <Link href="#" className="text-[#FA7921] hover:underline">conditions d'utilisation</Link> de Dourbia
                </label>
              </div>

              <button
                type="submit"
                className="w-[256px] h-[51px] rounded-full bg-[#5ED8F2] py-3 font-medium text-white hover:bg-[#4AC0D8] text-sm"
              >
                S'inscrire
              </button>
            </div>
            <p className="mt-4 text-center text-xs text-gray-500">
              <Link href="/login" className="text-[#002863] hover:underline">Vous avez déjà un compte ?</Link>
            </p>
          </form>
        </div>
      </div>
    </main>
  );
}
