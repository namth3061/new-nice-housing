"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Plus, Search, LayoutGrid, List, MapPin, Edit3, Trash2 } from "lucide-react";
import Swal from "sweetalert2";

const THEME_COLOR = "#F5D060";

const formatVND = (amount: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);

type ViewMode = "table" | "grid";
type SortKey = "id" | "name" | "rawPrice" | "location" | "stars";

type PropertyStatus = "available" | "unavailable";

interface PropertyRow {
  id: number;
  name: string;
  category?: string;
  location: string;
  address?: string;
  province?: string;
  district?: string;
  ward?: string;
  rawPrice: number;
  price?: string;
  stars: number;
  image: string;
  status?: PropertyStatus;
}

/** Hiển thị địa điểm: ưu tiên location/address có chữ, tránh hiển thị mã số (70, 689...) */
function displayLocation(prop: PropertyRow): string {
  const loc = (prop.location ?? "").trim();
  const addr = (prop.address ?? "").trim();
  const hasRealText = (s: string) => /[a-zA-ZÀ-ỹ]/.test(s);
  if (hasRealText(loc)) return loc;
  if (addr) return addr;
  const parts = [prop.province, prop.district, prop.ward].filter(Boolean).join(", ");
  return hasRealText(parts) ? parts : "—";
}

export default function PropertiesPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortKey>("id");
  const [sortAsc, setSortAsc] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [properties, setProperties] = useState<PropertyRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    setLoading(true);
    fetch(`/api/properties?${params}`)
      .then((r) => r.json())
      .then((data) => setProperties(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [search, statusFilter]);

  const filtered = useMemo(() => {
    const list = [...properties];
    list.sort((a, b) => {
      let va: string | number = a[sortBy] ?? (sortBy === "id" ? a.id : "");
      let vb: string | number = b[sortBy] ?? (sortBy === "id" ? b.id : "");
      if (sortBy === "rawPrice") {
        va = a.rawPrice;
        vb = b.rawPrice;
      }
      if (sortBy === "id") {
        va = a.id;
        vb = b.id;
      }
      if (typeof va === "string" && typeof vb === "string")
        return sortAsc ? va.localeCompare(vb) : vb.localeCompare(va);
      return sortAsc ? (va as number) - (vb as number) : (vb as number) - (va as number);
    });
    return list;
  }, [properties, sortBy, sortAsc]);

  const handleDeleteClick = (prop: PropertyRow) => {
    Swal.fire({
      title: "Xóa chỗ nghỉ",
      text: `Bạn có chắc muốn xóa "${prop.name}"? Hành động này không thể hoàn tác.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        try {
          const res = await fetch(`/api/properties/${prop.id}`, { method: "DELETE" });
          if (!res.ok) throw new Error("Failed to delete");
          return true;
        } catch (error) {
          Swal.showValidationMessage(`Không thể xóa: ${error}`);
        }
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.isConfirmed) {
        setProperties((prev) => prev.filter((p) => p.id !== prop.id));
        Swal.fire({
          title: "Đã xóa!",
          text: "Chỗ nghỉ đã được xóa thành công.",
          icon: "success",
          confirmButtonColor: "#10b981"
        });
      }
    });
  };

  return (
    <div className="space-y-6 min-w-0">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="min-w-0">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 truncate">Quản lý Chỗ nghỉ</h2>
          <p className="text-sm text-slate-500">Danh sách tài sản đang được niêm yết</p>
        </div>
        <Link
          href="/admin/properties/new"
          style={{ backgroundColor: THEME_COLOR }}
          className="text-slate-900 px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 font-bold shadow-md hover:brightness-95 transition-all shrink-0"
        >
          <Plus size={20} />
          Thêm chỗ nghỉ
        </Link>
      </div>

      <div className="flex flex-wrap items-center gap-3 sm:gap-4">
        <div className="relative w-full sm:flex-1 sm:min-w-[180px] sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 shrink-0" size={18} />
          <input
            type="text"
            placeholder="Tìm theo tên, vị trí..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border rounded-xl outline-none focus:ring-2 admin-input min-w-0"
            style={{ ["--tw-ring-color" as string]: THEME_COLOR }}
          />
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortKey)}
            className="px-3 py-2.5 border rounded-xl outline-none focus:ring-2 admin-input text-sm shrink-0"
            style={{ ["--tw-ring-color" as string]: THEME_COLOR }}
          >
            <option value="id">Sắp xếp: Mới nhất (ID)</option>
            <option value="name">Sắp xếp: Tên</option>
            <option value="rawPrice">Sắp xếp: Giá</option>
            <option value="location">Sắp xếp: Vị trí</option>
          </select>
          <button
            onClick={() => setSortAsc((a) => !a)}
            className="px-3 py-2.5 border rounded-xl hover:bg-slate-50 text-sm shrink-0"
          >
            {sortAsc ? "A→Z" : "Z→A"}
          </button>
          <div className="flex rounded-lg border overflow-hidden shrink-0">
            <button
              onClick={() => setViewMode("table")}
              className={`p-2.5 ${viewMode === "table" ? "bg-slate-100 text-slate-900" : "text-slate-400"}`}
            >
              <List size={20} />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2.5 ${viewMode === "grid" ? "bg-slate-100 text-slate-900" : "text-slate-400"}`}
            >
              <LayoutGrid size={20} />
            </button>
          </div>
        </div>
      </div>

      {loading && (
        <p className="text-slate-500">Đang tải...</p>
      )}
      {viewMode === "table" ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left admin-table min-w-[640px]">
              <thead>
                <tr>
                  <th className="min-w-[60px] w-14 text-center">STT</th>
                  <th className="min-w-[200px]">Tên & Hình ảnh</th>
                  <th className="min-w-[120px]">Danh mục</th>
                  <th className="min-w-[140px]">Địa chỉ</th>
                  <th className="min-w-[120px]">Giá/Đêm</th>
                  <th className="min-w-[100px]">Trạng thái</th>
                  <th className="min-w-[90px]">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((prop, index) => (
                  <tr key={prop.id} className="hover:bg-slate-50">
                    <td className="text-center font-medium text-slate-600 tabular-nums">
                      {index + 1}
                    </td>
                    <td>
                      <div className="flex items-center gap-3">
                        <img
                          src={prop.image || "/window.svg"}
                          alt=""
                          className="w-12 h-12 rounded-lg object-cover shadow-sm"
                        />
                        <span className="font-bold text-slate-800">{prop.name}</span>
                      </div>
                    </td>
                    <td className="text-slate-600">{prop.category || "—"}</td>
                    <td className="text-slate-600 font-medium">
                      <div className="flex items-center gap-1">
                        <MapPin size={14} className="text-slate-400 shrink-0" />
                        {displayLocation(prop)}
                      </div>
                    </td>
                    <td className="font-bold text-slate-900">{prop.price ?? formatVND(prop.rawPrice)}</td>
                    <td>
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${
                          (prop.status ?? "available") === "available"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {(prop.status ?? "available") === "available" ? "Available" : "Unavailable"}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/admin/properties/${prop.id}/edit`}
                          className="flex items-center justify-center w-9 h-9 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 transition-all"
                          title="Sửa"
                        >
                          <Edit3 size={16} />
                        </Link>
                        <button
                          onClick={() => handleDeleteClick(prop)}
                          className="flex items-center justify-center w-9 h-9 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-all"
                          title="Xóa"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 min-w-0">
          {filtered.map((prop) => (
            <div
              key={prop.id}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow min-w-0"
            >
              <img
                src={prop.image || "/window.svg"}
                alt=""
                className="w-full h-40 object-cover bg-slate-100"
              />
              <div className="p-4">
                <h3 className="font-bold text-slate-800 truncate">{prop.name}</h3>
                {prop.category && <p className="text-xs text-slate-500 mt-0.5">{prop.category}</p>}
                <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                  <MapPin size={14} />
                  {displayLocation(prop)}
                </p>
                <p className="font-bold text-slate-900 mt-2">{prop.price ?? formatVND(prop.rawPrice)}</p>
                <span
                  className={`inline-block mt-2 px-2.5 py-1 rounded-full text-xs font-bold ${
                    (prop.status ?? "available") === "available"
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {(prop.status ?? "available") === "available" ? "Available" : "Unavailable"}
                </span>
                <div className="flex items-center gap-2 mt-3">
                  <Link
                    href={`/admin/properties/${prop.id}/edit`}
                    className="inline-flex items-center gap-1 text-sm font-semibold"
                    style={{ color: THEME_COLOR }}
                  >
                    Chỉnh sửa →
                  </Link>
                  <button
                    onClick={() => handleDeleteClick(prop)}
                    className="flex items-center justify-center w-8 h-8 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-all shrink-0"
                    title="Xóa"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="text-center py-16 text-slate-500">
          Không tìm thấy chỗ nghỉ nào.
        </div>
      )}
    </div>
  );
}
