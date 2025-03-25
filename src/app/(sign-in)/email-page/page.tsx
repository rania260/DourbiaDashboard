'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const EmailPass = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:8000/auth/password/send-code', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                // Stocker l'email pour la prochaine étape
                localStorage.setItem('resetEmail', email);
                router.push('/code-verification');
            } else {
                setError(data.message || 'Une erreur est survenue');
            }
        } catch (error) {
            setError('Erreur de connexion au serveur');
        } finally {
            setLoading(false);
        }
    };

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
                <img
                    src="/logo4.png" width={90} height={45} className="mx-auto mb-17"
                />

                {/* Titre */}
                <h1 className="text-[30px] mb-14 text-[#FB7822] font-abeezee">
                    Mot de passe oublié
                </h1>

                {/* Texte descriptif */}
                <p className="text-center text-[15px] mb-14 opacity-100 text-[#474747] leading-6 font-abeezee ">
                    Nous vous enverrons un code de réinitialisation<br />
                    de votre mot de passe par e-mail
                </p>

                {error && (
                    <p className="text-red-500 mb-4 text-sm">{error}</p>
                )}

                <form onSubmit={handleSubmit} className="w-full flex flex-col items-center">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Adresse e-mail"
                        className="w-[500px] h-[45px] rounded-[15px] px-4 py-2.5 border border-[#5ED8F2] outline-none text-sm mb-17 opacity-100 text-[#718096] font-abeezee"
                        required
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-[200px] h-[37px] bg-[#FB7822] text-white rounded-[15px] py-3 text-m opacity-100 hover:bg-[#FB7822] font-abeezee flex justify-center items-center"
                    >
                        {loading ? 'Envoi...' : 'Confirmer'}
                    </button>
                </form>

            </div>
        </div>
    );
};

export default EmailPass;
