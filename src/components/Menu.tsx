import Image from "next/image";
import Link from "next/link";

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
        label: "Gestion contributions des utilisateurs",
        href: "/admin/contributions",
        visible: ["admin"],
      },
      {
        icon: "/events.png",
        label: "Gestion événements",
        href: "/admin/events",
        visible: ["admin"],
      },
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
        href: "/logout",
        visible: ["admin"],
      },
    ],
  },
];

const Menu = () => {
  return (
    <div className="mt-4 text-xs">
      {menuItems.map((section) => (
        <div className="flex flex-col gap-2" key={section.title}>
          <span className="hidden lg:block text-gray-400 font-light mb-2 text-xs">{section.title}</span>
          {section.items.map((item) => (
            <Link
              href={item.href}
              key={item.label}
              className="flex items-center justify-center lg:justify-start gap-3 px-3 py-2  md:px-2 rounded-md text-gray-500 hover:bg-[#c3ebfa] transition-all"
            >
              <Image src={item.icon} alt={item.label} width={16} height={16} />
              <span className="text-sm hidden lg:block">{item.label}</span>
            </Link>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Menu;
