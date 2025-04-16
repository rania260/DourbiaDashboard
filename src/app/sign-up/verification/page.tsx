"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import "../../../style/verification.css";

export default function VerificationForm() {
    const router = useRouter();
    const [code, setCode] = useState(Array(6).fill(""));
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [countdown, setCountdown] = useState(0);
    const inputRefs = useRef<(HTMLInputElement | null)[]>(Array(6).fill(null));

    useEffect(() => {
        const storedEmail = localStorage.getItem("signupEmail");
        if (storedEmail) {
            setEmail(storedEmail);
        }
    }, []);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (countdown > 0) {
            timer = setInterval(() => {
                setCountdown((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [countdown]);

    const handleCodeChange = (index: number, value: string) => {
        if (/^\d*$/.test(value) && value.length <= 1) {
            const newCode = [...code];
            newCode[index] = value;
            setCode(newCode);

            if (value && index < 5) {
                inputRefs.current[index + 1]?.focus();
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const otp = code.join("");

        if (otp.length !== 6) {
            setError("Veuillez entrer un code complet à 6 chiffres");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`http://localhost:8000/auth/verify-email/${otp}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Échec de la vérification");
            }

            localStorage.removeItem("signupEmail");
            router.push("/");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Une erreur inconnue est survenue");
        } finally {
            setLoading(false);
        }
    };

    const handleResendCode = async () => {
        const email = localStorage.getItem('signupEmail');
        if (!email) {
            setError('Email non trouvé');
            return;
        }
    
        try {
            const response = await fetch('http://localhost:8000/auth/password/resend-code', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });
    
            const data = await response.json();
    
            if (response.ok) {
                setError('');
                alert(data.message || 'Nouveau code envoyé !');
            } else {
                setError(data.message || 'Erreur lors de l\'envoi du code');
            }
        } catch {
            setError('Erreur lors de l\'envoi du code');
        }
    };

    return (
        <main className="main">
            {/* Left panel */}
            <div className="left">
                <div className="image-left">
                    <Image
                        src="/SignupImage.png"
                        alt="Background Dourbia"
                        layout="fill"
                        objectFit="cover"
                        className="background-image"
                    />
                    <div className="overlay">
                        <div className="logo-left">
                            <Image
                                src="/logo1.png"
                                alt="Logo Dourbia"
                                width={340}
                                height={210}
                                className="main-logo"
                            />
                        </div>
                        <h1 className="title-text-left">
                            BIENVENUE À <br />
                            <span>DOURBIA</span>
                        </h1>
                    </div>
                </div>
            </div>
            <div className="spacer"></div>
            {/* Right panel */}
            <div className="right-panel-code">
                <Image
                    src="/logo3.png"
                    alt="Logo Dourbia"
                    width={90}
                    height={80}
                    className="logo"
                />
                <div className="form-code">
                    <h2 className="verification-title">
                        Entrez le code de vérification
                    </h2>
                    <p className="verification-description">
                        Nous avons envoyé un code à 6 chiffres,<br />
                        saisissez-le ci-dessous
                    </p>
                    <form onSubmit={handleSubmit}>
                        <div className="code-inputs">
                            {code.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={(el) => {
                                        inputRefs.current[index] = el;
                                    }}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleCodeChange(index, e.target.value)}
                                    className="code-input"
                                    disabled={loading}
                                    autoFocus={index === 0}
                                />
                            ))}
                        </div>
                        {error && (
                            <p className={error.includes("succès") ? "success-message" : "error-message"}>
                                {error}
                            </p>
                        )}
                        <div className="action-buttons">
                            <button
                                type="button"
                                onClick={handleResendCode}
                                className="resend-button"
                                disabled={loading || countdown > 0}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 31 30" fill="none">
                                    <g clip-path="url(#clip0_7_176)">
                                        <path d="M15.6797 0.000375596C14.3027 0.000375596 12.9746 0.176155 11.6953 0.527713C10.416 0.879271 9.21973 1.38219 8.10645 2.03648C6.99316 2.69077 5.98242 3.47201 5.07422 4.3802C4.16602 5.2884 3.38477 6.30401 2.73047 7.42704C2.07617 8.55007 1.57324 9.74635 1.22168 11.0159C0.870117 12.2854 0.689453 13.6135 0.679688 15.0002C0.679688 16.3771 0.855469 17.7052 1.20703 18.9845C1.55859 20.2638 2.06152 21.4601 2.71582 22.5733C3.37012 23.6866 4.15137 24.6973 5.05957 25.6055C5.96777 26.5137 6.9834 27.295 8.10645 27.9492C9.22949 28.6035 10.4258 29.1065 11.6953 29.458C12.9648 29.8096 14.293 29.9902 15.6797 30C17.3594 30 18.9707 29.7314 20.5137 29.1943C22.0566 28.6572 23.4678 27.9053 24.7471 26.9385C26.0264 25.9717 27.1299 24.8096 28.0576 23.4522C28.9854 22.0948 29.6738 20.6105 30.123 18.9992L28.3213 18.5011C27.9307 19.9171 27.3301 21.211 26.5195 22.3829C25.709 23.5548 24.7422 24.5704 23.6191 25.4297C22.4961 26.2891 21.2607 26.9483 19.9131 27.4073C18.5654 27.8662 17.1543 28.1055 15.6797 28.125C14.4785 28.125 13.3213 27.9688 12.208 27.6563C11.0947 27.3438 10.0498 26.9043 9.07324 26.3379C8.09668 25.7715 7.20801 25.0831 6.40723 24.2725C5.60645 23.462 4.92285 22.5782 4.35645 21.6212C3.79004 20.6642 3.3457 19.6193 3.02344 18.4865C2.70117 17.3537 2.54492 16.1916 2.55469 15.0002C2.55469 13.799 2.71094 12.6418 3.02344 11.5286C3.33594 10.4153 3.77539 9.37038 4.3418 8.39383C4.9082 7.41727 5.59668 6.52861 6.40723 5.72784C7.21777 4.92707 8.10156 4.24349 9.05859 3.67709C10.0156 3.11069 11.0605 2.66636 12.1934 2.3441C13.3262 2.02183 14.4883 1.86559 15.6797 1.87535C16.9395 1.87535 18.165 2.05113 19.3564 2.40269C20.5479 2.75425 21.6563 3.25717 22.6816 3.91146C23.707 4.56575 24.6396 5.35187 25.4795 6.26983C26.3193 7.18779 27.0029 8.22293 27.5303 9.37526L23.1797 9.37526L23.1797 11.2502L30.6797 11.2502L30.6797 3.75033L28.8047 3.75033L28.8047 7.76395C28.1504 6.56279 27.3545 5.48371 26.417 4.52669C25.4795 3.56967 24.4443 2.75913 23.3115 2.09508C22.1787 1.43102 20.9629 0.91345 19.6641 0.542361C18.3652 0.171272 17.0371 -0.00938991 15.6797 0.000375596Z" fill="#002863" />
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_7_176">
                                            <rect width="30" height="30" fill="white" transform="matrix(-1 0 0 1 30.6797 0)" />
                                        </clipPath>
                                    </defs>
                                </svg>
                                {countdown > 0 ? `Renvoyer dans ${countdown}s` : "Renvoi du code"}
                            </button>
                            <button
                                type="submit"
                                className="next-button"
                                disabled={loading}
                            >
                                {loading ? "Vérification..." : "Suivant"}
                                {!loading && (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="29" viewBox="0 0 44 43" fill="none">
                                        <g filter="url(#filter0_d_7_180)">
                                            <circle cx="20.1797" cy="19.5" r="17.5" transform="rotate(-180 20.1797 19.5)" fill="#5ED8F2" />
                                        </g>
                                        <path d="M8.16792 20.9437L27.7097 20.9437L19.1722 28.3878C18.4899 28.9827 18.4899 29.959 19.1722 30.5539C19.334 30.6953 19.5263 30.8075 19.7379 30.8841C19.9496 30.9606 20.1764 31 20.4056 31C20.6347 31 20.8616 30.9606 21.0732 30.8841C21.2849 30.8075 21.4771 30.6953 21.639 30.5539L33.1681 20.5013C33.3302 20.3602 33.4589 20.1925 33.5467 20.008C33.6345 19.8235 33.6797 19.6257 33.6797 19.4259C33.6797 19.2261 33.6345 19.0283 33.5467 18.8437C33.4589 18.6592 33.3302 18.4916 33.1681 18.3504L21.639 8.29784C21.477 8.15661 21.2847 8.04459 21.0731 7.96815C20.8614 7.89172 20.6346 7.85238 20.4056 7.85238C20.1765 7.85238 19.9497 7.89172 19.7381 7.96815C19.5264 8.04459 19.3341 8.15661 19.1722 8.29784C19.0102 8.43907 18.8817 8.60673 18.7941 8.79125C18.7064 8.97577 18.6613 9.17355 18.6613 9.37327C18.6613 9.573 18.7064 9.77077 18.7941 9.95529C18.8817 10.1398 19.0102 10.3075 19.1722 10.4487L27.7097 17.8928L8.16792 17.8928C7.2057 17.8928 6.41843 18.5793 6.41843 19.4182C6.41843 20.2572 7.2057 20.9437 8.16792 20.9437Z" fill="white" />
                                        <defs>
                                            <filter id="filter0_d_7_180" x="0.679688" y="0" width="43" height="43" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                                                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                                                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                                <feOffset dx="2" dy="2" />
                                                <feGaussianBlur stdDeviation="2" />
                                                <feComposite in2="hardAlpha" operator="out" />
                                                <feColorMatrix type="matrix" values="0 0 0 0 0.694118 0 0 0 0 0.694118 0 0 0 0 0.694118 0 0 0 0.25 0" />
                                                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_7_180" />
                                                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_7_180" result="shape" />
                                            </filter>
                                        </defs>
                                    </svg>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
}