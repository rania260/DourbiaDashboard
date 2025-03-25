'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const VerificationCode = () => {
    const router = useRouter();
    const [code, setCode] = useState<string[]>(new Array(6).fill(''));
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (element: HTMLInputElement, index: number) => {
        if (isNaN(Number(element.value))) return false;

        setCode([...code.map((d, idx) => (idx === index ? element.value : d))]);

        // Focus next input
        if (element.value && index < 5) {
            const nextInput = element.nextElementSibling as HTMLInputElement;
            if (nextInput) nextInput.focus();
        }
    };

    const handleSubmit = async () => {
        const otp = code.join('');
        if (otp.length !== 6) {
            setError('Veuillez entrer les 6 chiffres');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await fetch(`http://localhost:8000/auth/password/verify-code/${otp}`, {
                method: 'POST',
            });

            const data = await response.json();

            if (response.ok) {
                router.push('/forgot-password');
            } else {
                setError(data.message || 'Code incorrect');
            }
        } catch (error) {
            setError('Erreur de connexion au serveur');
        } finally {
            setLoading(false);
        }
    };

    const handleResendCode = async () => {
        const email = localStorage.getItem('resetEmail');
        if (!email) {
            setError('Email non trouvé');
            return;
        }

        try {
            const response = await fetch('http://localhost:8000/auth/password/send-code', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });
            
            if (response.ok) {
                setError('');
                alert('Nouveau code envoyé !');
            } else {
                const data = await response.json();
                setError(data.message || 'Erreur lors de l\'envoi du code');
            }
        } catch (error) {
            setError('Erreur lors de l\'envoi du code');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="bg-white rounded-xl shadow-lg flex flex-col items-center backdrop-blur-sm border border-gray-300"
                style={{ width: '590px', height: '706px', padding: '20px 40px' }}>
                <Image src="/logo4.png" alt="Logo" width={90} height={45} className="mx-auto mb-17" />
                
                <h1 className="text-[30px] mb-14 text-[#FB7822] font-abeezee">
                    Code de vérification
                </h1>

                <p className="text-center text-[15px] mb-14 opacity-100 text-[#474747] leading-6 font-abeezee">
                    Nous avons envoyé un code à 6 chiffres,<br />
                    Saisissez le code ci-dessous
                </p>

                {error && (
                    <p className="text-red-500 mb-4 text-sm">{error}</p>
                )}

                <div className="flex gap-3 mb-16">
                    {code.map((digit, index) => (
                        <input
                            key={index}
                            type="text"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleChange(e.target, index)}
                            className="w-[38.79px] h-[45px] text-center bg-transparent border-2 rounded-md
                            border-[#5ED8F2] focus:ring-2 focus:ring-[#5ED8F2]/30 outline-none"
                        />
                    ))}
                </div>

                <div className="flex flex-col items-center gap-6 w-full">
                    <button 
                        onClick={handleResendCode}
                        className="text-[#002863] hover:underline flex items-center text-sm"
                    >
                        <Image src="/renvoi.png" alt="Renvoi" width={16} height={16} className="mr-2" />
                        Renvoi du code
                    </button>

                    <button 
                        onClick={handleSubmit}
                        disabled={loading}
                        className="text-xl text-[#5ED8F2] hover:underline flex items-center"
                    >
                        {loading ? 'Vérification...' : 'Suivant'}
                        <Image src="/suivant.png" alt="Suivant" width={16} height={16} className="ml-2" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VerificationCode;
