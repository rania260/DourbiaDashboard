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
        visible: ["ADMIN", "EXPERT"],
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
        visible: ["ADMIN"],
      },
      {
        icon: "/users.png",
        label: "Gestion Partenaire",
        href: "/list/partenaire",
        visible: ["ADMIN"],
      },
      {
        icon: "/users.png",
        label: "Gestion Expert",
        href: "/list/expert",
        visible: ["ADMIN"],
      },
      {
        icon: "/destination.jpg",
        label: "Gestion Destinations",
        href: "/list/destinations",
        visible: ["ADMIN"],
      },
      {
        icon: "/monument.jpg",
        label: "Gestion Monuments",
        href: "/list/monuments",
        visible: ["ADMIN", "EXPERT"],
      },
      {
        icon: "/tours.png",
        label: "Gestion Circuits",
        href: "/list/tours",
        visible: ["ADMIN"],
      },
      {
        icon: "/content.png",
        label: "Contribution",
        href: "/list/content",
        visible: ["ADMIN", "EXPERT"],
      },
      {
        icon: "/packages.png",
        label: "Gestion Pack",
        href: "/list/packages",
        visible: ["ADMIN"],
      },
      {
        icon: "/subscriptions.png",
        label: "Gestion Abonnements",
        href: "/list/subscriptions",
        visible: ["ADMIN"],
      },
      {
        icon: "/events.png",
        label: "Feedback",
        href: "/list/feedback",
        visible: ["ADMIN"],
      },
      {
        icon: "/contributions.png",
        label: "Blog",
        href: "/list/blog",
        visible: ["ADMIN"],
      },
      {
        icon: "/events.png",
        label: "Nos Références",
        href: "/list/reference",
        visible: ["ADMIN"],
      },
      {
        icon: "/contact.png",
        label: "Contacts",
        href: "/list/contact",
        visible: ["ADMIN"],
      },
      {
        icon: "/contact.png",
        label: "Services",
        href: "/list/servicesPartenaire",
        visible: ["PARTENAIRE"],
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
        visible: ["ADMIN", "EXPERT","PARTENAIRE"],
      },
      {
        icon: "/setting.png",
        label: "Paramètres",
        href: "/settings",
        visible: ["ADMIN", "EXPERT","PARTENAIRE"],
      },
      {
        icon: "/logout.png",
        label: "Déconnexion",
        href: "#",
        visible: ["ADMIN", "EXPERT","PARTENAIRE"],
        isLogout: true, 
      }
    ],
  },
];

import { useAuth } from "../app/context/auth-context";

const Menu = () => {
  const router = useRouter();
  const { user } = useAuth();
  const userRole = user?.role || "";
  console.log("user", user, "userRole", userRole);

  const handleLogout = async () => {
    try {
      // En JWT stateless, il suffit de supprimer les infos locales
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("isLoggedIn");
      // Optionnel : reset du contexte Auth si besoin
      // setUser(null); setToken(null); setIsLoggedIn(false);
      router.push("/");
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error);
    }
  };

  

  return (
    <div className="mt-4 text-xs">
      {menuItems.map((section) => (
        <div className="flex flex-col gap-2" key={section.title}>
          <span className="hidden lg:block text-gray-400 font-light mb-2 text-xs">{section.title}</span>
          {section.items
            .filter(item => item.visible.includes(userRole.toUpperCase()))
            .map((item) =>
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
