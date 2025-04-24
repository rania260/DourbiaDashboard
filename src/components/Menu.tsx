"use client";

import Image from "next/image";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

const menuItems = [
  {
    title: "",
    items: [
      {
        icon: "/dashboard.png",
        label: "Tableau de bord",
        href: "/admin",
        visible: ["admin"],
      },
    ],
  },
  {
    title: "",
    items: [
      {
        icon: "/users.png",
        label: "Gestion Utilisateur",
        href: "/list/users",
        visible: ["admin"],
      },
      {
        icon: "/destination.jpg",
        label: "Gestion Destinations",
        href: "/admin/destinations",
        visible: ["admin"],
      },
      {
        icon: "/monument.jpg",
        label: "Gestion Monuments",
        href: "/admin/monuments",
        visible: ["admin"],
      },
      {
        icon: "/tours.png",
        label: "Gestion Circuits",
        href: "/admin/tours",
        visible: ["admin"],
      },
      {
        icon: "/content.png",
        label: "Gestion Contenu",
        href: "/admin/content",
        visible: ["admin"],
      },
      {
        icon: "/packages.png",
        label: "Gestion Pack",
        href: "/admin/packages",
        visible: ["admin"],
      },
      {
        icon: "/subscriptions.png",
        label: "Gestion Abonnements",
        href: "/admin/subscriptions",
        visible: ["admin"],
      },
      {
        icon: "/contributions.png",
        label: "Contributions des utilisateurs",
        href: "/admin/contributions",
        visible: ["admin"],
      },
      {
        icon: "/events.png",
        label: "Evénements",
        href: "/admin/events",
        visible: ["admin"],
      },
      {
        icon: "/contact.png",
        label: "Contact Requests",
        href: "/list/contact",
        visible: ["admin"],
      }
      
    ],
  },
  {
    title: "OTHER",
    items: [
      {
        icon: "/profile.png",
        label: "Profil",
        href: "/profile",
        visible: ["admin"],
      },
      {
        icon: "/setting.png",
        label: "Paramètres",
        href: "/settings",
        visible: ["admin"],
      },
      {
        icon: "/logout.png",
        label: "Déconnexion",
        href: "#",
        visible: ["admin"],
        isLogout: true, // ← On marque cette ligne comme spéciale
      },
    ],
  },
];

const Menu = () => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:8000/auth/logout", {
        method: "POST",
        credentials: "include", // ← important pour envoyer les cookies
      });
  
      if (response.ok) {
        // Redirige vers la page de connexion ou d'accueil
        router.push("/"); // ou "/"
      } else {
        console.error("Erreur lors de la déconnexion");
      }
    } catch (error) {
      console.error("Erreur réseau :", error);
    }
  };
  

  return (
    <div className="mt-4 text-xs">
      {menuItems.map((section) => (
        <div className="flex flex-col gap-2" key={section.title}>
          <span className="hidden lg:block text-gray-400 font-light mb-2 text-xs">{section.title}</span>
          {section.items.map((item) =>
            item.isLogout ? (
              <button
                key={item.label}
                onClick={handleLogout}
                className="flex items-center justify-center lg:justify-start gap-3 px-3 py-2 md:px-2 rounded-md text-gray-500 hover:bg-[#c3ebfa] transition-all"
              >
                <Image src={item.icon} alt={item.label} width={16} height={16} />
                <span className="text-sm hidden lg:block">{item.label}</span>
              </button>
            ) : (
              <Link
                href={item.href}
                key={item.label}
                className="flex items-center justify-center lg:justify-start gap-3 px-3 py-2 md:px-2 rounded-md text-gray-500 hover:bg-[#c3ebfa] transition-all"
              >
                <Image src={item.icon} alt={item.label} width={16} height={16} />
                <span className="text-sm hidden lg:block">{item.label}</span>
              </Link>
            )
          )}
        </div>
      ))}
    </div>
  );
};

export default Menu;
