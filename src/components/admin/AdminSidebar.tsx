"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Layers,
  ShoppingBag,
  Users,
  CreditCard,
  Sliders,
  Tag,
  Star,
  LifeBuoy,
  Settings,
  History,
  Store,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { Logo } from "@/components/common/Logo";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils/cn";

interface AdminSidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();
  const { logout } = useAuth();

  const navGroups = [
    {
      title: "OVERVIEW",
      items: [
        {
          label: "Dashboard",
          href: "/admin",
          icon: <LayoutDashboard className="h-4 w-4" />,
          exact: true,
        },
      ],
    },
    {
      title: "CATALOG & PRODUCTS",
      items: [
        {
          label: "Products",
          href: "/admin/products",
          icon: <Package className="h-4 w-4" />,
        },
        {
          label: "Categories",
          href: "/admin/categories",
          icon: <FolderTree className="h-4 w-4" />,
        },
        {
          label: "Subscription Plans",
          href: "/admin/plans",
          icon: <Layers className="h-4 w-4" />,
        },
      ],
    },
    {
      title: "SALES & FULFILLMENT",
      items: [
        {
          label: "Orders Management",
          href: "/admin/orders",
          icon: <ShoppingBag className="h-4 w-4" />,
        },
        {
          label: "Payment Verification",
          href: "/admin/payments",
          icon: <CreditCard className="h-4 w-4" />,
        },
        {
          label: "Payment Methods",
          href: "/admin/payment-methods",
          icon: <Sliders className="h-4 w-4" />,
        },
        {
          label: "Coupons & Discounts",
          href: "/admin/coupons",
          icon: <Tag className="h-4 w-4" />,
        },
      ],
    },
    {
      title: "MANAGEMENT & SUPPORT",
      items: [
        {
          label: "Customers",
          href: "/admin/customers",
          icon: <Users className="h-4 w-4" />,
        },
        {
          label: "Support Tickets",
          href: "/admin/support",
          icon: <LifeBuoy className="h-4 w-4" />,
        },
        {
          label: "Reviews & Ratings",
          href: "/admin/reviews",
          icon: <Star className="h-4 w-4" />,
        },
      ],
    },
    {
      title: "SYSTEM",
      items: [
        {
          label: "Store Settings",
          href: "/admin/settings",
          icon: <Settings className="h-4 w-4" />,
        },
        {
          label: "Site Appearance",
          href: "/admin/settings/appearance",
          icon: <Sliders className="h-4 w-4" />,
        },
        {
          label: "Audit Logs",
          href: "/admin/audit-logs",
          icon: <History className="h-4 w-4" />,
        },
      ],
    },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 bg-[#29294D] text-[#AAAAC1] transition-transform duration-300 lg:static lg:translate-x-0 flex flex-col border-r border-[#353560]/40 shadow-neu-raised",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Sidebar Top Logo */}
        <div className="p-6 border-b border-[#353560]/40">
          <Logo variant="admin" size="md" />
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
          {navGroups.map((group, idx) => (
            <div key={idx} className="space-y-1.5">
              <div className="px-3 text-[10px] font-mono font-bold uppercase tracking-widest text-[#777790]">
                {group.title}
              </div>
              {group.items.map((item) => {
                const isActive =
                  item.href === "/admin"
                    ? pathname === "/admin"
                    : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      "flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-mono font-bold transition-all duration-200",
                      isActive
                        ? "bg-[#303057] text-[#716DFF] shadow-neu-pressed border border-[#353560]/40"
                        : "text-[#AAAAC1] hover:text-[#F5F5FA] hover:bg-[#303057]"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span className={cn(isActive ? "text-[#716DFF]" : "text-[#777790]")}>{item.icon}</span>
                      <span>{item.label}</span>
                    </div>
                    {isActive && <ChevronRight className="h-4 w-4 text-[#716DFF]" />}
                  </Link>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[#353560]/40 space-y-2">
          <Link
            href="/"
            className="flex items-center gap-2.5 px-3 py-2 rounded-2xl text-xs font-mono font-semibold text-[#AAAAC1] hover:bg-[#303057] hover:text-[#F5F5FA] transition-colors"
          >
            <Store className="h-4 w-4 text-[#716DFF]" />
            <span>Switch to Console Store</span>
          </Link>

          <button
            onClick={logout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-2xl text-xs font-mono font-semibold text-[#EF7B98] hover:bg-[#303057] transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out Admin</span>
          </button>
        </div>
      </aside>
    </>
  );
};
