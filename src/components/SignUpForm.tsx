"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import "../style/register.css";

export default function SignUpForm() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [country, setCountry] = useState("");
  const [region, setRegion] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Les mots de passe ne correspondent pas");
      return;
    }
    try {
      const response = await fetch("http://localhost:8000/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: fullName,
          email,
          password,
          country,
          region,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        router.push("/sign-up/verification");
      } else {
        alert(data.message || "Erreur lors de l'inscription");
      }
    } catch (error) {
      console.error("Erreur complète:", error);
      alert("Problème de connexion avec le serveur");
    }
  };

  return (
    <main className="main-container">
      {/* Partie Gauche - Image */}
      <div className="left-panel">
        <div className="image-container">
          <Image
            src="/SignupImage.png"
            alt="Background Dourbia"
            layout="fill"
            objectFit="cover"
            className="background-image"
          />
          <div className="overlay">
            <div className="logo-position">
              <Image
                src="/logo1.png"
                alt="Logo Dourbia"
                width={340}
                height={210}
                className="main-logo"
              />
            </div>
            <h1 className="title-text">
              BIENVENUE À <br />
              <span>DOURBIA</span>
            </h1>
          </div>
        </div>
      </div>

      <div className="spacer"></div>

      {/* Partie Droite - Formulaire */}
      <div className="right-panel">
        <Image
          src="/logo3.png"
          alt="Logo Dourbia"
          width={90}
          height={80}
          className="logo"
        />
        <div className="form-container">
          <h2 className="form-title">Créer un compte</h2>
          <form onSubmit={handleSubmit} className="auth-form">
            {/* Input Nom complet */}
            <div className="input-group">
              <input
                type="text"
                placeholder="Nom et prénom "
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="form-input"
                required
              />
              {!fullName && (
                <span className="orange-star">*</span>
              )}
            </div>
            {/* Input Email */}
            <div className="input-group">
              <input
                type="email"
                placeholder="Adresse e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                required
              />
              {!email && (
                <span className="orange-star-email">*</span>
              )}
            </div>
            {/* Input Mot de passe */}
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                required
              />
              {!password && (
                <span className="orange-star-password">*</span>
              )}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="password-toggle"
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

            {/* Input Confirmation mot de passe */}
            <div className="input-group">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirmer mot de passe"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="form-input"
                required
              />
              {!confirmPassword && (
                <span className="orange-star-password-confirm">*</span>
              )}
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="password-toggle"
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

            {/* Input Pays */}
            <div className="input-group">
              <input
                type="text"
                placeholder="Pays"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="form-input"
                required
              />
            </div>

            {/* Input Région */}
            <div className="input-group">
              <input
                type="text"
                placeholder="Région"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="form-input"
                required
              />
            </div>

            {/* Checkbox Conditions */}
            <div className="terms-checkbox" onClick={() => setAcceptedTerms(!acceptedTerms)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="31"
                height="30"
                viewBox="0 0 31 30"
                fill="none"
              >
                {/* Carré de base */}
                <path fill-rule="evenodd" clip-rule="evenodd" d="M3.37699 15.8499V23.4009H24.0656V10.8612L24.0786 10.8462V3.29518L3.38997 3.29518L3.38997 15.8349L3.37699 15.8499ZM27.4554 26.6966V26.697H-0.000488281V-0.000616963H0.000210349L0.000210349 -0.000976562L27.4561 -0.000973273L27.4561 26.6966H27.4554Z" fill="#C7C2C2" />


                {/* Tick qui s'affiche seulement si acceptedTerms === true */}
                {acceptedTerms && (
                  <path
                    d="M14.7716 21.9375L6.60425 13.9957L10.296 10.4059L14.4435 14.4419L26.9619 0L30.9575 3.27069L14.7716 21.9375Z"
                    fill="#C7C2C2"
                  />
                )}
              </svg>
              <label htmlFor="remember">J&apos;accepte les{" "}
                <Link href="#">conditions d&apos;utilisation</Link>{" "}
                de Dourbia
              </label>
            </div>

            {/* Bouton d'inscription */}
            <button type="submit" className="signup-button">
              S'inscrire
            </button>

            {/* Lien de connexion */}
            <Link href="/" className="login-link">
              Vous avez déjà un compte?
            </Link>
          </form>
        </div>
      </div>
    </main>
  );
}