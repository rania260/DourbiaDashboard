'use client';

const EmailPass = () => {
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

                {/* Email affiché */}
                <input
                    type="email"
                    placeholder="Adresse e-mail"
                    className="w-[500px] h-[45px] rounded-[15px] px-4 py-2.5 border border-[#5ED8F2] outline-none text-sm mb-17 opacity-100 text-[#718096] font-abeezee"
                />
                {/* Bouton Confirmer */}
                <div className="flex flex-col justify-center items-center mx-auto ">
                    <button
                        className="w-[200px] h-[37px] bg-[#FB7822] text-white rounded-[15px] py-3 text-m opacity-100 hover:bg-[#FB7822] font-abeezee flex justify-center items-center"
                    >
                        Confirmer
                    </button>
                </div>

            </div>
        </div>
    );
};

export default EmailPass;
