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
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M9.7459 8.98329L14.0267 4.70897C14.1089 4.60876 14.151 4.48154 14.1446 4.35206C14.1382 4.22257 14.0839 4.10009 13.9923 4.00842C13.9006 3.91675 13.7781 3.86246 13.6486 3.8561C13.5192 3.84974 13.3919 3.89177 13.2917 3.97401L9.0174 8.25479L4.74307 3.97401C4.64286 3.89177 4.51564 3.84974 4.38616 3.8561C4.25668 3.86246 4.13419 3.91675 4.04252 4.00842C3.95085 4.10009 3.89656 4.22257 3.8902 4.35206C3.88384 4.48154 3.92587 4.60876 4.00811 4.70897L8.28889 8.98329L4.00811 13.2576C3.91127 13.3554 3.85693 13.4875 3.85693 13.6251C3.85693 13.7627 3.91127 13.8948 4.00811 13.9926C4.1067 14.0879 4.23846 14.1412 4.37559 14.1412C4.51272 14.1412 4.64449 14.0879 4.74307 13.9926L9.0174 9.7118L13.2917 13.9926C13.3903 14.0879 13.5221 14.1412 13.6592 14.1412C13.7963 14.1412 13.9281 14.0879 14.0267 13.9926C14.1235 13.8948 14.1779 13.7627 14.1779 13.6251C14.1779 13.4875 14.1235 13.3554 14.0267 13.2576L9.7459 8.98329Z" fill="#FF0000" />
                <circle cx="9" cy="9" r="8.5" stroke="#FF0000" />
              </svg> Le mot de passe doit contenir au moins 8 caractères
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
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M9.7459 8.98329L14.0267 4.70897C14.1089 4.60876 14.151 4.48154 14.1446 4.35206C14.1382 4.22257 14.0839 4.10009 13.9923 4.00842C13.9006 3.91675 13.7781 3.86246 13.6486 3.8561C13.5192 3.84974 13.3919 3.89177 13.2917 3.97401L9.0174 8.25479L4.74307 3.97401C4.64286 3.89177 4.51564 3.84974 4.38616 3.8561C4.25668 3.86246 4.13419 3.91675 4.04252 4.00842C3.95085 4.10009 3.89656 4.22257 3.8902 4.35206C3.88384 4.48154 3.92587 4.60876 4.00811 4.70897L8.28889 8.98329L4.00811 13.2576C3.91127 13.3554 3.85693 13.4875 3.85693 13.6251C3.85693 13.7627 3.91127 13.8948 4.00811 13.9926C4.1067 14.0879 4.23846 14.1412 4.37559 14.1412C4.51272 14.1412 4.64449 14.0879 4.74307 13.9926L9.0174 9.7118L13.2917 13.9926C13.3903 14.0879 13.5221 14.1412 13.6592 14.1412C13.7963 14.1412 13.9281 14.0879 14.0267 13.9926C14.1235 13.8948 14.1779 13.7627 14.1779 13.6251C14.1779 13.4875 14.1235 13.3554 14.0267 13.2576L9.7459 8.98329Z" fill="#FF0000" />
                <circle cx="9" cy="9" r="8.5" stroke="#FF0000" />
              </svg>
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
