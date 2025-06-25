// Navbar.tsx
'use client';
import Image from "next/image";
import { useAuth } from '../app/context/auth-context';
import { useEffect } from 'react';

function getUserFromLocalStorage() {
  try {
    const userStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    if (!userStr) return {};
    return JSON.parse(userStr);
  } catch {
    return {};
  }
}

const Navbar = () => {
  const { user, fetchProfile, token } = useAuth();

  // Si user est null mais token existe, tente de recharger le profil
  useEffect(() => {
    if (!user && token) {
      fetchProfile();
    }
  }, [user, token, fetchProfile]);

  // Fallback localStorage si jamais user reste null
  const localUser = getUserFromLocalStorage();
  const username = user?.username || localUser.username || 'Invité';
  const role = user?.role || localUser.role || 'Utilisateur';

  return (
    <div className='flex items-center justify-between p-4'>
      {/* SEARCH BAR */}

      {/* ICONS AND USER */}
      <div className='flex items-center gap-6 justify-end w-full'>
        <div className='bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer'>
          <Image src="/message.png" alt="" width={20} height={20}/>
        </div>
        <div className='bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer relative'>
          <Image src="/announcement.png" alt="" width={20} height={20}/>
          <div className='absolute -top-3 -right-3 w-5 h-5 flex items-center justify-center bg-orange-500 text-white rounded-full text-xs'>1</div>
        </div>
        <div className='flex flex-col'>
          <span className="text-xs leading-3 font-medium">
            {user?.username || 'Invité'}
          </span>
          <span className="text-[10px] text-gray-500 text-right">
            {user?.role || 'Utilisateur'}
          </span>
        </div>
        <Image 
          src="/avatar.jpeg" 
          alt={`Avatar de ${user?.username || 'Invité'}`} 
          width={36} 
          height={36} 
          className="rounded-full"
          title={`${user?.username || 'Invité'} (${user?.role || 'Utilisateur'})`}
        />
      </div>
    </div>
  );
};

export default Navbar;