'use client';

import Image from 'next/image';
import { useState } from 'react';

const VerificationCode = () => {
  const [code, setCode] = useState<string[]>(new Array(6).fill(''));

  return (
    <div className="flex justify-center items-center min-h-screen">
      {/* Cadre principal avec bordure similaire */}
      <div
        className="bg-white rounded-xl shadow-lg flex flex-col items-center backdrop-blur-sm border border-gray-300"
        style={{
          width: '590px',
          height: '706px',
          padding: '20px 40px'
        }}
      >
        {/* Logo */}
        <Image
          src="/logo4.png"
          alt="Logo Societica"
          width={90}
          height={45}
          className="mx-auto mb-17"
        />

        {/* Titre */}
        <h1 className="text-[30px] mb-14 text-[#FB7822] font-abeezee">
          Code de vérification
        </h1>

        {/* Texte descriptif */}
        <p className="text-center text-[15px] mb-14 opacity-100 text-[#474747] leading-6 font-abeezee">
          Nous avons envoyé un code à 6 chiffres,<br />
          Saisissez le code ci-dessous
        </p>

        {/* Champs OTP */}
        <div className="flex gap-3 mb-16">
          {code.map((_, index) => (
            <input
              key={index}
              type="text"
              maxLength={1}
              className="w-[38.79px] h-[45px] text-center bg-transparent border-2 rounded-md
              border-[#5ED8F2] focus:ring-2 focus:ring-[#5ED8F2]/30 outline-none"
            />
          ))}
        </div>

        {/* Boutons */}
        <div className="flex flex-col items-center gap-6 w-full">
          <button className="text-[#002863] hover:underline flex items-center text-sm">
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
  );
};

export default VerificationCode;
