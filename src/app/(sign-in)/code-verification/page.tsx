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
            const response = await fetch('http://localhost:8000/auth/verification-otp', {
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
                    <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 30 24" fill="none">
                        <g clip-path="url(#clip0_7_1203)">
                            <path d="M15 0.000300477C13.623 0.000300477 12.2949 0.140924 11.0156 0.42217C9.73633 0.703417 8.54004 1.10576 7.42676 1.62919C6.31348 2.15262 5.30273 2.77761 4.39453 3.50416C3.48633 4.23072 2.70508 5.04321 2.05078 5.94163C1.39648 6.84006 0.893555 7.79708 0.541992 8.81269C0.19043 9.8283 0.00976563 10.8908 0 12.0002C0 13.1017 0.175781 14.1642 0.527344 15.1876C0.878906 16.211 1.38184 17.1681 2.03613 18.0587C2.69043 18.9493 3.47168 19.7579 4.37988 20.4844C5.28809 21.211 6.30371 21.836 7.42676 22.3594C8.5498 22.8828 9.74609 23.2852 11.0156 23.5664C12.2852 23.8477 13.6133 23.9922 15 24C16.6797 24 18.291 23.7852 19.834 23.3555C21.377 22.9258 22.7881 22.3242 24.0674 21.5508C25.3467 20.7774 26.4502 19.8477 27.3779 18.7618C28.3057 17.6759 28.9941 16.4884 29.4434 15.1993L27.6416 14.8009C27.251 15.9337 26.6504 16.9688 25.8398 17.9063C25.0293 18.8438 24.0625 19.6563 22.9395 20.3438C21.8164 21.0313 20.5811 21.5586 19.2334 21.9258C17.8857 22.293 16.4746 22.4844 15 22.5C13.7988 22.5 12.6416 22.375 11.5283 22.125C10.415 21.875 9.37012 21.5235 8.39355 21.0704C7.41699 20.6172 6.52832 20.0665 5.72754 19.418C4.92676 18.7696 4.24316 18.0626 3.67676 17.297C3.11035 16.5313 2.66602 15.6954 2.34375 14.7892C2.02148 13.8829 1.86523 12.9533 1.875 12.0002C1.875 11.0392 2.03125 10.1135 2.34375 9.22284C2.65625 8.33223 3.0957 7.4963 3.66211 6.71506C4.22852 5.93382 4.91699 5.22289 5.72754 4.58227C6.53809 3.94166 7.42188 3.39479 8.37891 2.94167C9.33594 2.48855 10.3809 2.13309 11.5137 1.87528C12.6465 1.61747 13.8086 1.49247 15 1.50028C16.2598 1.50028 17.4854 1.6409 18.6768 1.92215C19.8682 2.2034 20.9766 2.60574 22.002 3.12917C23.0273 3.6526 23.96 4.2815 24.7998 5.01586C25.6396 5.75023 26.3232 6.57834 26.8506 7.50021L22.5 7.50021L22.5 9.00019L30 9.00019L30 3.00026L28.125 3.00026L28.125 6.21116C27.4707 5.25024 26.6748 4.38696 25.7373 3.62135C24.7998 2.85573 23.7646 2.2073 22.6318 1.67606C21.499 1.14482 20.2832 0.73076 18.9844 0.433889C17.6855 0.137018 16.3574 -0.00751193 15 0.000300477Z" fill="#002863" />
                        </g>
                        <defs>
                            <clipPath id="clip0_7_1203">
                                <rect width="30" height="24" fill="white" transform="matrix(-1 0 0 1 30 0)" />
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
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="29" viewBox="0 0 43 43" fill="none">
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
