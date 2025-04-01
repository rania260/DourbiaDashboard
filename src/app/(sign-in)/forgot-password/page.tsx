'use client';
import { useState } from "react";
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Eye, EyeOff } from "lucide-react";
import '../../../style/forgot-password.css';

const ForgotPassword = () => {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordMismatch, setPasswordMismatch] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMismatch(true);
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');
    setPasswordMismatch(false);

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
    <div className="forgot-container">
      <Image 
        src="/logo4.png" 
        alt="Logo" 
        width={90} 
        height={45} 
        className="forgot-logo" 
      />

      <h1 className="forgot-title">
        Réinitialisez le mot de passe
      </h1>

      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}

      <form onSubmit={handleSubmit} className="forgot-form">
        {/* Nouveau mot de passe */}
        <div className="input-container">
          <input
            type={showNewPassword ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Nouveau mot de passe"
            className="forgot-input"
            required
          />
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowNewPassword(!showNewPassword)}
          >
            {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
          {newPassword.length > 0 && newPassword.length < 8 && (
            <p className="password-requirement">
              Le mot de passe doit contenir au moins 8 caractères.
            </p>
          )}
        </div>

        {/* Confirmer le mot de passe */}
        <div className="input-container">
          <input
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setPasswordMismatch(newPassword !== e.target.value);
            }}
            placeholder="Confirmer le mot de passe"
            className="forgot-input"
            required
          />
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
          {passwordMismatch && (
            <p className="error-message">
              Les deux mots de passe sont différents
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="submit-button"
        >
          {loading ? 'Modification...' : 'Valider'}
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
