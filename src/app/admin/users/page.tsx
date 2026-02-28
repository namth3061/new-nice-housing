"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Search, Mail, UserPlus, MoreVertical, Pencil } from "lucide-react";

const THEME_COLOR = "#F5D060";

interface UserRow {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: "user" | "host" | "admin";
  joinedAt: string;
  bookingsCount: number;
  status: "active" | "blocked";
}

const roleConfig: Record<UserRow["role"], { label: string; cls: string }> = {
  user: { label: "Khách hàng", cls: "badge badge-blue" },
  host: { label: "Chủ nhà", cls: "badge badge-gold" },
  admin: { label: "Quản trị", cls: "badge badge-slate" },
};

const avatarColors: Record<UserRow["role"], string> = {
  user: "rgba(99,102,241,0.12)",
  host: "rgba(245,208,96,0.18)",
  admin: "rgba(16,185,129,0.12)",
};

const avatarTextColors: Record<UserRow["role"], string> = {
  user: "#4f46e5",
  host: "#92670a",
  admin: "#059669",
};

function formatJoinedAt(val: string | Date): string {
  if (typeof val === "string") return val.slice(0, 10);
  if (val instanceof Date) return val.toISOString().slice(0, 10);
  return "";
}

export default function UsersPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams();
    if (roleFilter !== "all") params.set("role", roleFilter);
    if (search.trim()) params.set("search", search.trim());
    setLoading(true);
    fetch(`/api/users?${params}`)
      .then((r) => r.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        setUsers(list.map((u: any) => ({
          ...u,
          joinedAt: formatJoinedAt(u.joinedAt ?? ""),
          bookingsCount: u.bookingsCount ?? 0,
        })));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [search, roleFilter]);

  const filtered = useMemo(() => users, [users]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h2 style={{ fontSize: "22px", fontWeight: 800, color: "#0f172a", marginBottom: "4px" }}>
            Quản lý Người dùng
          </h2>
          <p style={{ fontSize: "13px", color: "#94a3b8" }}>
            Danh sách tài khoản trên hệ thống
          </p>
        </div>
        <Link href="/admin/users/new" className="admin-btn-gold" style={{ display: "inline-flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
          <UserPlus size={18} /> Thêm người dùng
        </Link>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
        <div className="admin-search-wrap" style={{ flex: "1", minWidth: "200px", maxWidth: "380px" }}>
          <Search size={16} className="icon" />
          <input
            type="text"
            placeholder="Tìm theo tên, email, SĐT..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="admin-input"
            style={{ width: "100%", paddingLeft: "40px" }}
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="admin-select"
          style={{ minWidth: "160px" }}
        >
          <option value="all">Tất cả vai trò</option>
          <option value="user">Khách hàng</option>
          <option value="host">Chủ nhà</option>
          <option value="admin">Quản trị</option>
        </select>
      </div>

      {/* User Table */}
      <div className="admin-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Người dùng</th>
              <th>Liên hệ</th>
              <th>Vai trò</th>
              <th>Ngày tham gia</th>
              <th style={{ textAlign: "center" }}>Đơn hàng</th>
              <th>Trạng thái</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u.id}>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{
                      width: "40px", height: "40px", borderRadius: "50%",
                      background: avatarColors[u.role],
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontWeight: 800, fontSize: "15px",
                      color: avatarTextColors[u.role],
                      flexShrink: 0,
                    }}>
                      {u.name.charAt(0)}
                    </div>
                    <div>
                      <p style={{ fontWeight: 700, color: "#0f172a", margin: 0, fontSize: "14px" }}>{u.name}</p>
                      <p style={{ fontSize: "12px", color: "#94a3b8", margin: 0 }}>#{u.id}</p>
                    </div>
                  </div>
                </td>
                <td>
                  <div style={{ fontSize: "13px" }}>
                    <p style={{ display: "flex", alignItems: "center", gap: "5px", color: "#475569", margin: 0 }}>
                      <Mail size={13} /> {u.email}
                    </p>
                    <p style={{ color: "#94a3b8", margin: "2px 0 0", fontSize: "12px" }}>{u.phone}</p>
                  </div>
                </td>
                <td>
                  <span className={roleConfig[u.role].cls}>{roleConfig[u.role].label}</span>
                </td>
                <td style={{ color: "#64748b", fontSize: "13px" }}>{formatJoinedAt(u.joinedAt)}</td>
                <td style={{ textAlign: "center" }}>
                  <span style={{ fontWeight: 700, color: "#0f172a" }}>{u.bookingsCount}</span>
                </td>
                <td>
                  <span className={u.status === "active" ? "badge badge-green" : "badge badge-red"}>
                    {u.status === "active" ? "Hoạt động" : "Đã khóa"}
                  </span>
                </td>
                <td>
                  <Link
                    href={`/admin/users/${u.id}/edit`}
                    className="admin-form-back"
                    style={{
                      padding: "6px 10px",
                      borderRadius: "8px",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "var(--a-gold)",
                    }}
                    title="Chỉnh sửa"
                  >
                    <Pencil size={16} />
                    Sửa
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {loading && (
          <div style={{ textAlign: "center", padding: "32px 0", color: "#94a3b8" }}>Đang tải...</div>
        )}
        {!loading && filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "64px 0", color: "#cbd5e1" }}>
            <Search size={40} style={{ margin: "0 auto 12px", opacity: 0.4 }} />
            <p style={{ fontWeight: 600 }}>Không tìm thấy người dùng nào.</p>
          </div>
        )}
      </div>
    </div>
  );
}
