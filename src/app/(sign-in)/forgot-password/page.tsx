'use client';
import { useState } from "react";
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const ForgotPassword = () => {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://localhost:8000/auth/password/reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Mot de passe réinitialisé avec succès');
        // Attendre 2 secondes avant de rediriger
        setTimeout(() => {
          router.push('/');
        }, 2000);
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
          width: '590px', // largeur mise à jour
          height: '706px',
          padding: '20px 40px'
        }}
      >
        {/* Logo */}
        <Image src="/logo4.png" alt="Logo" width={90} height={45} className="mx-auto mb-17" />

        {/* Titre */}
        <h1 className="text-[30px] mb-14 text-[#FB7822] font-abeezee">
          Nouveau mot de passe
        </h1>

        {error && (
          <p className="text-red-500 mb-4 text-sm">{error}</p>
        )}

        {success && (
          <p className="text-green-500 mb-4 text-sm font-medium">{success}</p>
        )}

        <form onSubmit={handleSubmit} className="w-full flex flex-col items-center gap-4">
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Nouveau mot de passe"
            className="w-[500px] h-[45px] rounded-[15px] px-4 py-2.5 border border-[#5ED8F2] outline-none text-sm opacity-100 text-[#718096] font-abeezee"
            required
          />

          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirmer le mot de passe"
            className="w-[500px] h-[45px] rounded-[15px] px-4 py-2.5 border border-[#5ED8F2] outline-none text-sm opacity-100 text-[#718096] font-abeezee"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-[200px] h-[37px] bg-[#FB7822] text-white rounded-[15px] py-3 text-m opacity-100 hover:bg-[#FB7822] font-abeezee flex justify-center items-center mt-8"
          >
            {loading ? 'Modification...' : 'Confirmer'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
