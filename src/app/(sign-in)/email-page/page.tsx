'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import '../../../style/email.css';

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
        <div className="emailContainer">
            <Image
                src="/logo4.png"
                width={103}
                height={94}
                alt="Logo Dourbia"
                className="emaillogo"
            />
            <h1 className="emailtitle">
                Mot de passe oublié
            </h1>
            <p className="emaildescription">
                Nous vous enverrons un code de réinitialisation<br />
                de votre mot de passe par e-mail
            </p>
            {error && (
                <p className="error-message">{error}</p>
            )}
            <form onSubmit={handleSubmit} className="emailform">
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Adresse e-mail"
                    className="emailInput"
                    required
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="emailbutton"
                >
                    {loading ? 'Envoi...' : 'Confirmer'}
                </button>
            </form>
        </div>
    );
};

export default EmailPass;
