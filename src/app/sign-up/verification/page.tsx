"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function VerificationForm() {
    const router = useRouter();
    const [code, setCode] = useState(Array(6).fill(""));
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const inputRefs = useRef<(HTMLInputElement | null)[]>(Array(6).fill(null));

    useEffect(() => {
        const storedEmail = localStorage.getItem("signupEmail");
        if (storedEmail) {
            setEmail(storedEmail);
        }
    }, []);

    const handleCodeChange = (index: number, value: string) => {
        if (/^\d*$/.test(value) && value.length <= 1) {
            const newCode = [...code];
            newCode[index] = value;
            setCode(newCode);

            if (value && index < 5) {
                inputRefs.current[index + 1]?.focus();
            }
        }
    };

// Modification de la requête fetch
const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
  
    const otp = code.join("");
  
    if (otp.length !== 6) {
      setError("Veuillez entrer un code complet à 6 chiffres");
      setLoading(false);
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:8000/auth/verify/${otp}`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          // Ajoutez ici votre header d'authentification si nécessaire
        },
        body: JSON.stringify({ email }), // Envoyer l'email dans le body
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || "Échec de la vérification");
      }
  
      localStorage.removeItem("signupEmail");
      router.push("/sign-in?verified=1");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur inconnue est survenue");
    } finally {
      setLoading(false);
    }
  };

    const handleResendCode = async () => {
        try {
            const response = await fetch("http://localhost:8000/auth/verification-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Échec de l'envoi du code");
            }

            setError("Nouveau code envoyé avec succès !");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Échec de l'envoi du code");
        }
    };

    return (
        <main className="min-h-screen bg-white grid grid-cols-[1fr_auto_1fr] items-stretch overflow-hidden">
            {/* Le reste du JSX reste inchangé */}
            <div className="relative border border-gray-300 backdrop-blur-sm shadow-lg rounded-r-lg overflow-hidden">
                <div className="w-full h-full relative">
                    <Image
                        src="/SignupImage.png"
                        alt="Background Dourbia"
                        layout="fill"
                        objectFit="cover"
                        className="rounded-l-lg"
                        priority
                    />
                    <div className="absolute inset-0 bg-black/20 flex flex-col items-center h-full p-8">
                        <div className="w-full flex justify-center pt-12">
                            <Image
                                src="/logo1.png"
                                alt="Logo Dourbia"
                                width={360}
                                height={180}
                                priority
                            />
                        </div>
                        <div className="flex-grow flex items-center justify-center">
                            <h1 className="text-5xl font-black text-white text-center">
                                BIENVENUE À <br /> <span>DOURBIA</span>
                            </h1>
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-16"></div>
            <div className="flex justify-center items-center border border-gray-300 backdrop-blur-sm shadow-lg rounded-l-lg">
                <div className="w-full max-w-md px-4 py-8 h-screen flex flex-col">
                    <Image
                        src="/logo3.png"
                        alt="Logo Dourbia"
                        width={90}
                        height={45}
                        className="mx-auto mb-14 mt-4"
                        priority
                    />
                    <div className="flex flex-col items-center justify-start flex-grow pt-8">
                        <h2 className="text-center text-xl text-[#FB7822] mb-3">Entrer le code de vérification</h2>
                        <p className="text-sm text-[#474747] text-center mb-4">
                            Nous avons envoyé un code à 6 chiffres, saisissez-le ci-dessous.
                        </p>
                        <form onSubmit={handleSubmit} className="w-full flex flex-col items-center">
                            <div className="flex gap-3 mb-4">
                                {code.map((digit, index) => (
                                    <input
                                        key={index}
                                        ref={(el) => {
                                            inputRefs.current[index] = el; 
                                        }}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleCodeChange(index, e.target.value)}
                                        className="w-10 h-12 text-center border-2 rounded-md border-[#5ED8F2] focus:ring-2 focus:ring-[#5ED8F2]/30 outline-none"
                                        disabled={loading}
                                        autoFocus={index === 0}
                                    />

                                ))}
                            </div>
                            {error && (
                                <p className={`text-sm mb-4 ${error.includes("succès") ? "text-green-500" : "text-red-500"}`}>
                                    {error}
                                </p>
                            )}
                            <div className="flex flex-col items-center gap-4 w-full mt-4">
                                <button
                                    type="button"
                                    onClick={handleResendCode}
                                    className="text-xl text-[#002863] hover:underline flex items-center disabled:opacity-50"
                                    disabled={loading}
                                >
                                    <Image
                                        src="/renvoi.png"
                                        alt="Renvoi"
                                        width={16}
                                        height={16}
                                        className="mr-2"
                                    />
                                    Renvoi du code
                                </button>
                                <button
                                    type="submit"
                                    className="text-xl text-[#5ED8F2] hover:underline flex items-center disabled:opacity-50"
                                    disabled={loading}
                                >
                                    {loading ? "Vérification..." : "Suivant"}
                                    {!loading && (
                                        <Image
                                            src="/suivant.png"
                                            alt="Suivant"
                                            width={16}
                                            height={16}
                                            className="ml-2"
                                        />
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    );
}