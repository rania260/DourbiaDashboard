'use client';

const EmailPass = () => {
    return (
        <div className="flex justify-center items-center min-h-screen">
            {/* Cadre principal avec bordure similaire */}
            <div
                className="bg-white rounded-xl shadow-lg flex flex-col items-center backdrop-blur-sm border border-gray-300"
                style={{
                    width: '527px',
                    height: '706px',
                    padding: '20px 40px'
                }}
            >
                {/* Logo */}
                <img
                    src="/logo4.png" width={90} height={45} className="mx-auto mb-17"
                />

                {/* Titre */}
                <h1 className="text-2xl mb-14 text-[#FB7822] style={{ fontFamily: 'ABeeZee' }}">
                    Mot de passe oublié
                </h1>

                {/* Texte descriptif */}
                <p className="text-center mb-14 text-[#474747] leading-6">
                    Nous vous enverrons un code de réinitialisation<br />
                    de votre mot de passe par e-mail
                </p>

                {/* Email affiché */}
                <input
          type="email"
          placeholder="Adresse e-mail"
          className="w-full max-w-lg h-[46px] rounded-md px-4 py-2.5 border border-[#5ED8F2] outline-none text-sm mb-17"
        />
        {/* Bouton Confirmer */}
        <button
          className="w-[200px] h-[41px] rounded-full bg-[#FB7822] py-3 font-medium text-white text-sm"
        >
          Confirmer
        </button>
            </div>
        </div>
    );
};

export default EmailPass;
