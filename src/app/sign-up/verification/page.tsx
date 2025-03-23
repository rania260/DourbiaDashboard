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

                },
                body: JSON.stringify({ email }),
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
                    {/* Logo (fixe) */}
                    <Image
                        src="/logo3.png"
                        alt="Logo Dourbia"
                        width={90}
                        height={80}
                        className="absolute top-[35px]"
                    />

                    {/* Contenu du formulaire */}
                    <div className="flex flex-col items-center justify-start flex-grow top-[210px] absolute">
                        <h2 className=" font-abeezee text-center text-[28px] text-[#FB7822] mb-2">
                            Entrez le code de vérification
                        </h2>
                        <p className="font-actor text-[16px] text-[#474747] text-center mb-16">
                            Nous avons envoyé un code à 6 chiffres,<br />
                            saisissez-le ci-dessous
                        </p>

                        {/* Formulaire */}
                        <form onSubmit={handleSubmit} className="w-full flex flex-col items-center">
                            <div className="flex gap-3 mb-9">
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
                                        className="w-[35px] h-[40px] text-center border-1 rounded-[5px] border-[#5ED8F2] focus:ring-2 focus:ring-[#5ED8F2]/30 outline-none opacity-100"
                                        disabled={loading}
                                        autoFocus={index === 0}
                                    />
                                ))}
                            </div>

                            {/* Message d'erreur */}
                            {error && (
                                <p className={`text-sm mb-4 ${error.includes("succès") ? "text-green-500" : "text-red-500"}`}>
                                    {error}
                                </p>
                            )}

                            {/* Boutons d'action */}
                            <div className="flex flex-col items-center gap-15 w-full mt-4">
                                <button
                                    type="button"
                                    onClick={handleResendCode}
                                    className="text-[25px] text-[#002863] font-inter hover:underline flex items-center disabled:opacity-50"
                                    disabled={loading}
                                >
                                    <Image
                                        src="/renvoi.png"
                                        alt="Renvoi"
                                        width={25}
                                        height={25}
                                        className="mr-2"
                                    />
                                    Renvoi du code
                                </button>
                                <button
                                    type="submit"
                                    className="text-[25px] font-inter text-[#5ED8F2] hover:underline flex items-center disabled:opacity-50"
                                    disabled={loading}
                                >
                                    {loading ? "Vérification..." : "Suivant"}
                                    {!loading && (
                                        <Image
                                            src="/suivant.png"
                                            alt="Suivant"
                                            width={35}
                                            height={35}
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