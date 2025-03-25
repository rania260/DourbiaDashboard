import { useRouter } from 'next/navigation';

export const api = {
  async fetch(url: string, options: RequestInit = {}) {
    // Ajouter le token aux headers
    const accessToken = localStorage.getItem('token');
    if (accessToken) {
      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${accessToken}`,
      };
    }

    try {
      const response = await fetch(`http://localhost:8000${url}`, options);
      
      // Si on reçoit une erreur 401, on essaie de rafraîchir le token
      if (response.status === 401) {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          try {
            const refreshResponse = await fetch('http://localhost:8000/auth/refresh-token', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ refreshToken }),
            });

            if (refreshResponse.ok) {
              const { accessToken: newAccessToken, refreshToken: newRefreshToken } = await refreshResponse.json();
              
              // Mettre à jour les tokens
              localStorage.setItem('token', newAccessToken);
              localStorage.setItem('refreshToken', newRefreshToken);

              // Réessayer la requête originale avec le nouveau token
              options.headers = {
                ...options.headers,
                Authorization: `Bearer ${newAccessToken}`,
              };
              return fetch(`http://localhost:8000${url}`, options);
            }
          } catch (error) {
            // Si le refresh échoue, déconnecter l'utilisateur
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            window.location.href = '/sign-in';
          }
        }
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  }
}; 