"use client";

import { useState } from "react";
import Image from "next/image";

export default function VerificationForm() {
    const [code, setCode] = useState(Array(6).fill(""));



    return (
        <main className="min-h-screen bg-white grid grid-cols-[1fr_auto_1fr] items-stretch overflow-hidden">
            {/* Partie Gauche - Image (inchangée) */}
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
                        <div className="w-full flex justify-center pt-12">
                            <Image
                                src="/logo1.png"
                                alt="Logo Dourbia"
                                width={360}
                                height={180}
                                className="mx-auto"
                            />
                        </div>
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

            {/* Partie Droite - Ajustements d'emplacement */}
            <div className="flex justify-center items-center border border-gray-300 backdrop-blur-sm shadow-lg rounded-l-lg">
                <div className="w-full max-w-md px-4 py-8 h-screen flex flex-col">
                    {/* Logo avec marge réduite */}
                    <Image
                        src="/logo3.png"
                        alt="Logo Dourbia"
                        width={90}
                        height={45}
                        className="mx-auto mb-14 mt-4"
                    />

                    {/* Contenu central remonté */}
                    <div className="flex flex-col items-center justify-start flex-grow pt-8"> {/* Ajout de pt-8 et justify-start */}
                        <h2 className="text-center text-xl text-[#FB7822] mb-3">
                            Entrer le code de vérification
                        </h2>

                        <p className="text-sm text-[#474747] text-center mb-13">
                            Nous avons envoyé un code à 6 chiffres,<br />
                            Saisissez le code ci-dessous
                        </p>

                        {/* Champs OTP */}
                        <div className="flex gap-3 mb-13">
                            {code.map((digit, index) => (
                                <input
                                    key={index}
                                    id={`code-${index}`}
                                    type="text"
                                    maxLength={1}
                                    value={digit}
                                    className="w-[38.79px] h-[45px] text-center bg-transparent border-2 rounded-md
            border-[#5ED8F2] focus:ring-2 focus:ring-[#5ED8F2]/30 outline-none"
                                />
                            ))}
                        </div>


                        {/* Boutons */}
                        <div className="flex flex-col items-center gap-4 w-full mt-4">
                            <button className="text-xl text-[#002863] hover:underline flex items-center">
                                <Image
                                    src="/renvoi.png"
                                    alt="Renvoi"
                                    width={16}
                                    height={16}
                                    className="mr-2"
                                />
                                Renvoi du code
                            </button>

                            <button className="text-xl text-[#5ED8F2] hover:underline flex items-center">
                                Suivant
                                <Image
                                    src="/suivant.png"
                                    alt="Suivant"
                                    width={16}
                                    height={16}
                                    className="ml-2"
                                />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}