'use client';

import { useState } from 'react';
import styles from './profile.module.css';

import { useEffect } from 'react';
import { useAuth } from '@/app/context/auth-context';

export default function ProfilePage() {
  const { user, fetchProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    country: '',
    region: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (!user) {
      fetchProfile();
    } else {
      setFormData({
        name: user.username || '',
        email: user.email || '',
        phone: user.phone || '',
        country: user.country || '',
        region: user.region || '',
        password: '',
        confirmPassword: ''
      });
    }
  }, [user, fetchProfile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Les mots de passe ne correspondent pas!");
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/auth/update/' + user?.id, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert("Profil mis à jour avec succès!");
        fetchProfile();
      } else {
        alert("Erreur lors de la mise à jour du profil");
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert("Erreur lors de la mise à jour du profil");
    }
  };

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <main className={styles.mainContent}>
        <form onSubmit={handleSubmit} className={styles.profileForm}>

          <div className={styles.avatarSection}>
            <div className={styles.avatarWrapper}>
              <div className={styles.avatarContainer}>
                <img
                  src="/default-avatar.jpg"
                  alt="Profile"
                  className={styles.avatarImage}
                />
                <label className={styles.avatarUploadLabel}>
                  <input
                    type="file"
                    accept="image/*"
                    className={styles.avatarUploadInput}
                  />
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <g clipPath="url(#clip0_575_991)">
                      <path d="M6.66667 15H15.3333M2.33333 10.6667L12 1C12.7956 1 13.5587 1.31607 14.1213 1.87868C14.6839 2.44129 15 3.20435 15 4L5.33333 13.6667H4.66667C3.35067 13.6667 2.41533 14.056 1.32 14.7867L1 15L1.21333 14.68C1.94467 13.584 2.33333 12.6487 2.33333 11.3333V10.6667Z" stroke="white" />
                    </g>
                    <defs>
                      <clipPath id="clip0_575_991">
                        <rect width="16" height="16" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </label>
              </div> 
            </div>
          </div>

          <div className={styles.formGroup}>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={styles.formInput}
              placeholder="Nom et prénom"
              required
              disabled={user?.username === formData.name}
            />
          </div>

          <div className={styles.formGroup}>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={styles.formInput}
              placeholder="Adresse e-mail"
              required
              disabled={user?.email === formData.email}
            />
          </div>

          <div className={styles.formGroup}>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={styles.formInput}
              placeholder="Téléphone/Whatsapp"
            />
          </div>

          <div className={styles.formGroup}>
            <div className={styles.passwordInputContainer}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={styles.formInput}
                placeholder="Mot de passe"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={styles.passwordToggle}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 18" fill="none">
                  {showPassword ? (
                    <>
                      <path d="M9.73 2.073C10.1516 2.0241 10.5756 1.99973 11 2C15.664 2 19.4 4.903 21 9C20.6127 9.99659 20.0894 10.9348 19.445 11.788M5.52 3.519C3.48 4.764 1.9 6.693 1 9C2.6 13.097 6.336 16 11 16C12.9321 16.0102 14.8292 15.484 16.48 14.48M8.88 6.88C8.6014 7.1586 8.3804 7.48935 8.22963 7.85335C8.07885 8.21736 8.00125 8.6075 8.00125 9.0015C8.00125 9.3955 8.07885 9.78564 8.22963 10.1496C8.3804 10.5137 8.6014 10.8444 8.88 11.123C9.1586 11.4016 9.48934 11.6226 9.85335 11.7734C10.2174 11.9242 10.6075 12.0018 11.0015 12.0018C11.3955 12.0018 11.7856 11.9242 12.1496 11.7734C12.5137 11.6226 12.8444 11.4016 13.123 11.123" stroke="#777272" strokeOpacity="0.5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M3 1L19 17" stroke="#777272" strokeOpacity="0.5" strokeLinecap="round" />
                    </>
                  ) : (
                    <path d="M11 2C6.336 2 2.6 4.903 1 9C2.6 13.097 6.336 16 11 16C15.664 16 19.4 13.097 21 9C19.4 4.903 15.664 2 11 2ZM11 13.5C8.51472 13.5 6.5 11.4853 6.5 9C6.5 6.51472 8.51472 4.5 11 4.5C13.4853 4.5 15.5 6.51472 15.5 9C15.5 11.4853 13.4853 13.5 11 13.5ZM11 6C9.34315 6 8 7.34315 8 9C8 10.6569 9.34315 12 11 12C12.6569 12 14 10.6569 14 9C14 7.34315 12.6569 6 11 6Z" fill="#777272" fillOpacity="0.5" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          <div className={styles.formGroup}>
            <div className={styles.passwordInputContainer}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={styles.formInput}
                placeholder="Confirmer mot de passe"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className={styles.passwordToggle}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 18" fill="none">
                  {showConfirmPassword ? (
                    <>
                      <path d="M9.73 2.073C10.1516 2.0241 10.5756 1.99973 11 2C15.664 2 19.4 4.903 21 9C20.6127 9.99659 20.0894 10.9348 19.445 11.788M5.52 3.519C3.48 4.764 1.9 6.693 1 9C2.6 13.097 6.336 16 11 16C12.9321 16.0102 14.8292 15.484 16.48 14.48M8.88 6.88C8.6014 7.1586 8.3804 7.48935 8.22963 7.85335C8.07885 8.21736 8.00125 8.6075 8.00125 9.0015C8.00125 9.3955 8.07885 9.78564 8.22963 10.1496C8.3804 10.5137 8.6014 10.8444 8.88 11.123C9.1586 11.4016 9.48934 11.6226 9.85335 11.7734C10.2174 11.9242 10.6075 12.0018 11.0015 12.0018C11.3955 12.0018 11.7856 11.9242 12.1496 11.7734C12.5137 11.6226 12.8444 11.4016 13.123 11.123" stroke="#777272" strokeOpacity="0.5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M3 1L19 17" stroke="#777272" strokeOpacity="0.5" strokeLinecap="round" />
                    </>
                  ) : (
                    <path d="M11 2C6.336 2 2.6 4.903 1 9C2.6 13.097 6.336 16 11 16C15.664 16 19.4 13.097 21 9C19.4 4.903 15.664 2 11 2ZM11 13.5C8.51472 13.5 6.5 11.4853 6.5 9C6.5 6.51472 8.51472 4.5 11 4.5C13.4853 4.5 15.5 6.51472 15.5 9C15.5 11.4853 13.4853 13.5 11 13.5ZM11 6C9.34315 6 8 7.34315 8 9C8 10.6569 9.34315 12 11 12C12.6569 12 14 10.6569 14 9C14 7.34315 12.6569 6 11 6Z" fill="#777272" fillOpacity="0.5" />
                  )}
                </svg>
              </button>
            </div>
            {formData.confirmPassword && (
              <span className={`${styles.inputHint} ${formData.password === formData.confirmPassword
                  ? styles.inputHintValid
                  : styles.inputHintInvalid
                }`}>
                {formData.password === formData.confirmPassword
                  ? 'Les mots de passe correspondent!'
                  : 'Les mots de passe ne correspondent pas'}
              </span>
            )}
          </div>

          <div className={styles.formGroup}>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className={styles.formInput}
              placeholder="Pays"
            />
          </div>

          <div className={styles.formGroup}>
            <input
              type="text"
              name="region"
              value={formData.region}
              onChange={handleChange}
              className={styles.formInput}
              placeholder="Région"
            />
          </div>

          <button type="submit" className={styles.submitButton}>
            Modifier
          </button>
        </form>
      </main>
    </div>
  );
}