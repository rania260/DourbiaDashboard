'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import '../../../style/codemail.css';

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
            const response = await fetch(`http://localhost:8000/auth/verify-email/${otp}`, {
                method: 'POST',
            });

            const data = await response.json();

            if (response.ok) {
                router.push('/forgot-password');
            } else {
                setError(data.message || 'Code incorrect');
            }
        } catch {
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
        <div className="code-container">
            <Image
                src="/logo4.png"
                alt="Logo Dourbia"
                width={103}
                height={94}
                className="code-logo"
            />

            <h1 className="code-title">
                Entrez le code de vérification
            </h1>

            <p className="code-description">
                Nous avons envoyé un code à 6 chiffres,<br />
                Saisissez le code ci-dessous
            </p>

            {error && (
                <p className="error-message">{error}</p>
            )}

            <div className="code-inputs">
                {code.map((digit, index) => (
                    <input
                        key={index}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleChange(e.target, index)}
                        className="code-input"
                    />
                ))}
            </div>

            <div className="code-buttons">
                <button
                    onClick={handleResendCode}
                    className="resend-button"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
                        <g clip-path="url(#clip0_559_395)">
                            <path d="M12.5 0.000312997C11.3525 0.000312997 10.2458 0.146796 9.17969 0.439761C8.11361 0.732726 7.1167 1.15183 6.18896 1.69707C5.26123 2.24231 4.41895 2.89334 3.66211 3.65017C2.90527 4.407 2.25423 5.25334 1.70898 6.1892C1.16374 7.12506 0.744629 8.12196 0.45166 9.17989C0.158691 10.2378 0.00813866 11.3446 0 12.5002C0 13.6476 0.146484 14.7544 0.439453 15.8204C0.732422 16.8865 1.15153 17.8834 1.69678 18.8111C2.24203 19.7388 2.89307 20.5811 3.6499 21.3379C4.40674 22.0948 5.25309 22.7458 6.18896 23.291C7.12484 23.8363 8.12174 24.2554 9.17969 24.5483C10.2376 24.8413 11.3444 24.9919 12.5 25C13.8997 25 15.2425 24.7762 16.5283 24.3286C17.8141 23.881 18.9901 23.2544 20.0562 22.4488C21.1222 21.6431 22.0418 20.6747 22.8149 19.5435C23.5881 18.4124 24.1618 17.1754 24.5361 15.8326L23.0347 15.4176C22.7091 16.5976 22.2087 17.6759 21.5332 18.6524C20.8577 19.629 20.0521 20.4753 19.1162 21.1915C18.1803 21.9076 17.1509 22.4569 16.0278 22.8394C14.9048 23.2219 13.7288 23.4212 12.5 23.4375C11.499 23.4375 10.5347 23.3073 9.60693 23.0469C8.6792 22.7865 7.80843 22.4203 6.99463 21.9483C6.18083 21.4763 5.44027 20.9026 4.77295 20.2271C4.10563 19.5517 3.53597 18.8152 3.06396 18.0177C2.59196 17.2201 2.22168 16.3494 1.95313 15.4054C1.68457 14.4614 1.55436 13.493 1.5625 12.5002C1.5625 11.4992 1.69271 10.5348 1.95313 9.60713C2.21354 8.6794 2.57975 7.80865 3.05176 6.99485C3.52376 6.18106 4.09749 5.44051 4.77295 4.7732C5.4484 4.10589 6.1849 3.53624 6.98242 3.06424C7.77995 2.59224 8.65072 2.22196 9.59473 1.95341C10.5387 1.68486 11.5072 1.55466 12.5 1.56279C13.5498 1.56279 14.5711 1.70928 15.564 2.00224C16.5568 2.29521 17.4805 2.71431 18.335 3.25955C19.1895 3.80479 19.9666 4.45989 20.6665 5.22486C21.3664 5.98982 21.936 6.85244 22.3755 7.81272L18.75 7.81272L18.75 9.3752L25 9.3752L25 3.12527L23.4375 3.12527L23.4375 6.46996C22.8923 5.46899 22.229 4.56975 21.4478 3.77224C20.6665 2.97472 19.8039 2.29927 18.8599 1.7459C17.9159 1.19252 16.9027 0.761208 15.8203 0.451968C14.738 0.142727 13.6312 -0.00782492 12.5 0.000312997Z" fill="#002863" />
                        </g>
                        <defs>
                            <clipPath id="clip0_559_395">
                                <rect width="25" height="25" fill="white" transform="matrix(-1 0 0 1 25 0)" />
                            </clipPath>
                        </defs>
                    </svg>
                    Renvoi du code
                </button>

                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="next-button"
                >
                    {loading ? 'Vérification...' : 'Suivant'}
                    <svg xmlns="http://www.w3.org/2000/svg" width="31" height="30" viewBox="0 0 43 43" fill="none">
                        <g filter="url(#filter0_d_7_1197)">
                            <circle cx="19.5" cy="19.5" r="17.5" transform="rotate(-180 19.5 19.5)" fill="#5ED8F2" />
                        </g>
                        <path d="M7.48823 20.9437L27.03 20.9437L18.4925 28.3878C17.8102 28.9827 17.8102 29.959 18.4925 30.5539C18.6543 30.6953 18.8466 30.8075 19.0582 30.8841C19.2699 30.9606 19.4968 31 19.7259 31C19.955 31 20.1819 30.9606 20.3935 30.8841C20.6052 30.8075 20.7974 30.6953 20.9593 30.5539L32.4884 20.5013C32.6506 20.3602 32.7792 20.1925 32.867 20.008C32.9548 19.8235 33 19.6257 33 19.4259C33 19.2261 32.9548 19.0283 32.867 18.8437C32.7792 18.6592 32.6506 18.4916 32.4884 18.3504L20.9593 8.29784C20.7973 8.15661 20.605 8.04459 20.3934 7.96815C20.1818 7.89172 19.9549 7.85238 19.7259 7.85238C19.4968 7.85238 19.27 7.89172 19.0584 7.96815C18.8467 8.04459 18.6545 8.15661 18.4925 8.29784C18.3305 8.43907 18.202 8.60673 18.1144 8.79125C18.0267 8.97577 17.9816 9.17355 17.9816 9.37327C17.9816 9.573 18.0267 9.77077 18.1144 9.95529C18.202 10.1398 18.3305 10.3075 18.4925 10.4487L27.03 17.8928L7.48823 17.8928C6.52601 17.8928 5.73874 18.5793 5.73874 19.4182C5.73874 20.2572 6.52601 20.9437 7.48823 20.9437Z" fill="white" />
                        <defs>
                            <filter id="filter0_d_7_1197" x="0" y="0" width="43" height="43" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                <feOffset dx="2" dy="2" />
                                <feGaussianBlur stdDeviation="2" />
                                <feComposite in2="hardAlpha" operator="out" />
                                <feColorMatrix type="matrix" values="0 0 0 0 0.694118 0 0 0 0 0.694118 0 0 0 0 0.694118 0 0 0 0.25 0" />
                                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_7_1197" />
                                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_7_1197" result="shape" />
                            </filter>
                        </defs>
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default VerificationCode;
