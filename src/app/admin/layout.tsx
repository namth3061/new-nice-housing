"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  CalendarCheck,
  Users,
  FileText,
  BookOpen,
  Shield,
  Briefcase,
  ChevronRight,
  Bell,
  Home,
} from "lucide-react";
import "./admin.css";

const THEME_COLOR = "#F5D060";

const menuGroups = [
  {
    label: "Tổng quan",
    items: [
      { id: "dashboard", label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    label: "Quản lý",
    items: [
      { id: "properties", label: "Chỗ nghỉ", href: "/admin/properties", icon: Building2 },
      { id: "bookings", label: "Đơn hàng", href: "/admin/bookings", icon: CalendarCheck },
      { id: "users", label: "Người dùng", href: "/admin/users", icon: Users },
      { id: "blogs", label: "Blog", href: "/admin/blogs", icon: BookOpen },
    ],
  },
  {
    label: "Nội dung",
    items: [
      { id: "policy", label: "Chính sách", href: "/admin/content?type=policy", icon: Shield },
      { id: "terms", label: "Điều khoản", href: "/admin/content?type=terms", icon: FileText },
    ],
  },
  {
    label: "Hệ thống",
    items: [
      { id: "settings", label: "Cài đặt", href: "/admin/settings", icon: Briefcase },
    ],
  },
];

function Sidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [logoUrl, setLogoUrl] = React.useState<string | null>(null);

  React.useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        if (data && !data.error && data.logo_url) setLogoUrl(data.logo_url);
      })
      .catch(() => {});
  }, []);

  const contentType = pathname === "/admin/content" ? searchParams.get("type") : null;

  const getActiveId = () => {
    if (pathname === "/admin/content") {
      return contentType === "policy" ? "policy" : "terms";
    }
    const allItems = menuGroups.flatMap((g) => g.items);
    return allItems.find((m) => pathname.startsWith(m.href.split("?")[0]))?.id ?? "dashboard";
  };

  const activeId = getActiveId();

  return (
    <aside className="admin-sidebar">
      {/* Logo */}
      <div className="admin-sidebar-logo" style={{ padding: '24px 20px', display: 'flex', justifyContent: 'center' }}>
        <img src={logoUrl || '/logo.png'} alt="Nine Housing" style={{ height: '48px', width: 'auto' }} />
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4 px-0" style={{ scrollbarWidth: "none" }}>
        {menuGroups.map((group) => (
          <div key={group.label}>
            <div className="admin-nav-section">{group.label}</div>
            {group.items.map((item) => {
              const isActive = item.id === activeId;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`admin-nav-item${isActive ? " active" : ""}`}
                >
                  <item.icon size={18} className="nav-icon" />
                  <span>{item.label}</span>
                  {isActive && (
                    <span
                      className="ml-auto w-1.5 h-1.5 rounded-full nav-dot"
                      style={{ background: THEME_COLOR }}
                    />
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      {/* User Panel */}
      <div className="admin-user-panel">
        <div className="admin-user-avatar">A</div>
        <div className="flex-1 min-w-0">
          <p className="admin-user-name truncate">Quản trị viên</p>
          <p className="admin-user-sub truncate">NineHousing Admin</p>
        </div>
      </div>
    </aside>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) {
    return <>{children}</>;
  }

  const segment = pathname.replace("/admin", "").split("/").filter(Boolean)[0] || "dashboard";
  const titleMap: Record<string, string> = {
    dashboard: "Tổng quan",
    properties: "Chỗ nghỉ",
    bookings: "Đơn hàng",
    users: "Người dùng",
    blogs: "Blog",
    content: "Nội dung",
  };
  const title = titleMap[segment] ?? "Hệ thống";

  React.useEffect(() => {
    document.title = `${title} - Quản trị Nine Housing`;
  }, [title]);

  return (
    <div className="admin-root min-h-screen" style={{ background: "#f8fafc" }}>
      <Suspense fallback={<aside className="admin-sidebar" />}>
        <Sidebar />
      </Suspense>

      <div className="admin-main">
        {/* Top Header */}
        <header className="admin-header">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm">
            <span className="text-slate-400 font-medium">Cổng Quản Trị</span>
            <ChevronRight size={14} className="text-slate-300" />
            <span className="font-bold text-slate-700">{title}</span>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Server Status */}
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border"
              style={{
                background: "rgba(16,185,129,0.08)",
                borderColor: "rgba(16,185,129,0.2)",
                color: "#059669",
              }}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse inline-block" />
              Trực tuyến
            </div>
            {/* Notifications */}
            <button className="relative w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors">
              <Bell size={16} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500" />
            </button>
            {/* Back to site */}
            <Link
              href="/"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-all text-xs font-semibold"
            >
              <Home size={14} />
              Trang chủ
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="admin-page-content">
          {children}
        </main>
      </div>
    </div>
  );
}
