"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, MapPin, Upload, X, ImageIcon, Sparkles, Banknote } from "lucide-react";

const THEME_COLOR = "#F5D060";
const STEPS = [
  { num: 1, label: "Thông tin & Vị trí", icon: MapPin },
  { num: 2, label: "Hình ảnh", icon: ImageIcon },
  { num: 3, label: "Tiện ích", icon: Sparkles },
  { num: 4, label: "Giá & Chính sách", icon: Banknote },
];

const AMENITIES_OPTIONS = [
  "Wifi",
  "Hồ bơi",
  "Bãi đỗ xe",
  "Bữa sáng",
  "Điều hòa",
  "Spa",
  "View biển",
  "Gym",
  "Bar",
  "Phòng họp",
];

interface FormData {
  name: string;
  province: string;
  district: string;
  ward: string;
  address: string;
  description: string;
  images: (File | string)[];
  imagePreviews: string[];
  amenities: string[];
  pricePerNight: string;
  maxGuests: string;
}

const emptyForm: FormData = {
  name: "",
  province: "",
  district: "",
  ward: "",
  address: "",
  description: "",
  images: [],
  imagePreviews: [],
  amenities: [],
  pricePerNight: "",
  maxGuests: "",
};

interface GeoItem {
  code: number;
  name: string;
  districts?: { code: number; name: string }[];
  wards?: { code: number; name: string }[];
}

export default function NewPropertyPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [provinces, setProvinces] = useState<GeoItem[]>([]);
  const [districts, setDistricts] = useState<GeoItem[]>([]);
  const [wards, setWards] = useState<GeoItem[]>([]);

  useEffect(() => {
    fetch("https://provinces.open-api.vn/api/p/")
      .then((res) => res.json())
      .then(setProvinces)
      .catch(console.error);
  }, []);

  const loadDistricts = (provinceCode: string) => {
    if (!provinceCode) {
      setDistricts([]);
      setWards([]);
      return;
    }
    fetch(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`)
      .then((res) => res.json())
      .then((data: GeoItem) => setDistricts(data.districts ?? []))
      .catch(console.error);
    setWards([]);
  };

  const loadWards = (districtCode: string) => {
    if (!districtCode) {
      setWards([]);
      return;
    }
    fetch(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`)
      .then((res) => res.json())
      .then((data: GeoItem) => setWards(data.wards ?? []))
      .catch(console.error);
  };

  const update = (part: Partial<FormData>) => setForm((f) => ({ ...f, ...part }));

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    const newFiles = Array.from(files).slice(0, 10 - form.images.length);
    const newPreviews = newFiles.map((f) => URL.createObjectURL(f));
    update({
      images: [...form.images, ...newFiles],
      imagePreviews: [...form.imagePreviews, ...newPreviews],
    });
  };

  const removeImage = (index: number) => {
    if (form.imagePreviews[index]?.startsWith("blob:")) URL.revokeObjectURL(form.imagePreviews[index]);
    update({
      images: form.images.filter((_, i) => i !== index),
      imagePreviews: form.imagePreviews.filter((_, i) => i !== index),
    });
  };

  const toggleAmenity = (name: string) => {
    update({
      amenities: form.amenities.includes(name)
        ? form.amenities.filter((a) => a !== name)
        : [...form.amenities, name],
    });
  };

  const handleSubmit = async () => {
    const slug = form.name
      ? form.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/g, "")
      : `property-${Date.now()}`;
    const locationStr = [form.province, form.district, form.ward].filter(Boolean).join(", ") || form.address;
    const imageUrls = form.imagePreviews.filter((p): p is string => typeof p === "string");
    const res = await fetch("/api/properties", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slug: slug || `property-${Date.now()}`,
        name: form.name,
        location: locationStr,
        province: form.province,
        district: form.district,
        ward: form.ward,
        address: form.address,
        description: form.description,
        image: imageUrls[0] || "",
        images: imageUrls,
        rawPrice: Number(form.pricePerNight) || 0,
        amenities: form.amenities,
        maxGuests: Number(form.maxGuests) || 2,
      }),
    });
    if (res.ok) router.push("/admin/properties");
  };

  const progressPercent = ((step - 1) / 3) * 100;

  return (
    <div className="max-w-3xl mx-auto min-w-0">
      <div className="mb-8">
        <Link
          href="/admin/properties"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors mb-4"
        >
          <ChevronLeft size={18} />
          Quay lại danh sách chỗ nghỉ
        </Link>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Đăng chỗ nghỉ mới
        </h1>
        <p className="text-slate-500 mt-1 text-sm">
          Hoàn thành 4 bước để đưa tài sản lên NiceHousing
        </p>
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-start relative">
          <div className="absolute top-5 left-0 right-0 h-0.5 bg-slate-200 rounded-full -z-10" aria-hidden />
          <div
            className="absolute top-5 left-0 h-0.5 rounded-full -z-10 transition-all duration-500 bg-[var(--a-gold)]"
            style={{ width: `${progressPercent}%` }}
            aria-hidden
          />
          {STEPS.map(({ num, label }) => {
            const isActive = step === num;
            const isDone = step > num;
            return (
              <div key={num} className="flex flex-col items-center gap-2 flex-1 max-w-[25%]">
                <div
                  className={`admin-step-dot shrink-0 ${isDone ? "done" : isActive ? "active" : ""}`}
                  aria-current={isActive ? "step" : undefined}
                >
                  {isDone ? "✓" : num}
                </div>
                <span
                  className={`text-xs font-semibold text-center leading-tight ${
                    isActive ? "text-slate-900" : isDone ? "text-slate-600" : "text-slate-400"
                  }`}
                >
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="admin-card overflow-hidden">
        <div className="p-6 sm:p-8 min-h-[340px]">
        {step === 1 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="admin-icon-box shrink-0" style={{ background: "var(--a-gold-dim)", color: THEME_COLOR }}>
                <MapPin size={22} />
              </div>
              <div>
                <h2 className="font-bold text-lg text-slate-900">Thông tin cơ bản & Vị trí</h2>
                <p className="text-sm text-slate-500">Điền địa chỉ và mô tả chỗ nghỉ</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Tên chỗ nghỉ</label>
                <input
                  type="text"
                  className="admin-input w-full"
                  placeholder="VD: Beachfront Luxury Villa"
                  value={form.name}
                  onChange={(e) => update({ name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Tỉnh / Thành phố</label>
                <select
                  value={form.province}
                  onChange={(e) => {
                    update({ province: e.target.value, district: "", ward: "" });
                    loadDistricts(e.target.value);
                  }}
                  className="admin-select w-full"
                >
                  <option value="">Chọn Tỉnh/Thành</option>
                  {provinces.map((p) => (
                    <option key={p.code} value={p.code}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Quận / Huyện</label>
                <select
                  disabled={!form.province}
                  value={form.district}
                  onChange={(e) => {
                    update({ district: e.target.value, ward: "" });
                    loadWards(e.target.value);
                  }}
                  className="admin-select w-full disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <option value="">Chọn Quận/Huyện</option>
                  {districts.map((d) => (
                    <option key={d.code} value={d.code}>{d.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Phường / Xã</label>
                <select
                  disabled={!form.district}
                  value={form.ward}
                  onChange={(e) => update({ ward: e.target.value })}
                  className="admin-select w-full disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <option value="">Chọn Phường/Xã</option>
                  {wards.map((w) => (
                    <option key={w.code} value={w.code}>{w.name}</option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Địa chỉ cụ thể</label>
                <input
                  type="text"
                  className="admin-input w-full"
                  placeholder="Số nhà, tên đường..."
                  value={form.address}
                  onChange={(e) => update({ address: e.target.value })}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Mô tả chi tiết</label>
                <textarea
                  className="admin-input w-full min-h-[120px] resize-y"
                  placeholder="Giới thiệu về chỗ nghỉ, view, tiện nghi..."
                  value={form.description}
                  onChange={(e) => update({ description: e.target.value })}
                />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="admin-icon-box shrink-0" style={{ background: "var(--a-gold-dim)", color: THEME_COLOR }}>
                <ImageIcon size={22} />
              </div>
              <div>
                <h2 className="font-bold text-lg text-slate-900">Hình ảnh</h2>
                <p className="text-sm text-slate-500">Tối đa 10 ảnh · Ảnh đầu tiên là ảnh đại diện</p>
              </div>
            </div>
            {form.imagePreviews.length === 0 ? (
              <label className="block border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center cursor-pointer hover:border-[var(--a-gold)] hover:bg-[var(--a-gold-dim)]/30 transition-all">
                <Upload size={48} className="mx-auto mb-4 opacity-60" style={{ color: THEME_COLOR }} />
                <p className="font-semibold text-slate-700">Nhấn để chọn ảnh hoặc kéo thả vào đây</p>
                <p className="text-xs text-slate-400 mt-1">PNG, JPG · tối đa 5MB/ảnh</p>
                <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageChange} />
              </label>
            ) : (
              <div className="flex flex-wrap gap-4">
                {form.imagePreviews.map((url, i) => (
                  <div key={i} className="relative group">
                    <img src={url} alt="" className="w-28 h-28 object-cover rounded-xl border border-slate-200 shadow-sm" />
                    {i === 0 && (
                      <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-900 text-white">
                        Đại diện
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute -top-1.5 -right-1.5 w-7 h-7 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-600"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
                {form.imagePreviews.length < 10 && (
                  <label className="w-28 h-28 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-[var(--a-gold)] hover:bg-slate-50 text-slate-500 transition-colors">
                    <Upload size={28} style={{ color: THEME_COLOR }} />
                    <span className="text-xs mt-1 font-medium">Thêm ảnh</span>
                    <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageChange} />
                  </label>
                )}
              </div>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="admin-icon-box shrink-0" style={{ background: "var(--a-gold-dim)", color: THEME_COLOR }}>
                <Sparkles size={22} />
              </div>
              <div>
                <h2 className="font-bold text-lg text-slate-900">Tiện ích</h2>
                <p className="text-sm text-slate-500">Chọn các tiện ích có tại chỗ nghỉ</p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {AMENITIES_OPTIONS.map((name) => {
                const selected = form.amenities.includes(name);
                return (
                  <label
                    key={name}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      selected
                        ? "border-[var(--a-gold)] bg-[var(--a-gold-dim)]"
                        : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() => toggleAmenity(name)}
                      className="w-5 h-5 rounded border-slate-300 text-[var(--a-gold)] focus:ring-[var(--a-gold)]"
                    />
                    <span className={`text-sm font-semibold ${selected ? "text-slate-900" : "text-slate-600"}`}>{name}</span>
                  </label>
                );
              })}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6 max-w-md">
            <div className="flex items-center gap-3">
              <div className="admin-icon-box shrink-0" style={{ background: "var(--a-gold-dim)", color: THEME_COLOR }}>
                <Banknote size={22} />
              </div>
              <div>
                <h2 className="font-bold text-lg text-slate-900">Giá & Chính sách</h2>
                <p className="text-sm text-slate-500">Đặt giá thuê theo đêm và số khách tối đa</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Giá thuê theo đêm (VNĐ)</label>
                <div className="relative">
                  <input
                    type="number"
                    className="admin-input w-full pr-12"
                    placeholder="0"
                    value={form.pricePerNight}
                    onChange={(e) => update({ pricePerNight: e.target.value })}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">₫</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Số khách tối đa</label>
                <input
                  type="number"
                  className="admin-input w-full"
                  placeholder="VD: 4"
                  value={form.maxGuests}
                  onChange={(e) => update({ maxGuests: e.target.value })}
                />
              </div>
            </div>
          </div>
        )}
        </div>

        <div className="flex flex-wrap justify-between gap-3 px-6 sm:px-8 py-4 border-t border-slate-100 bg-slate-50/60">
          <button
            type="button"
            disabled={step === 1}
            onClick={() => setStep((s) => s - 1)}
            className="admin-btn-ghost disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
          >
            Quay lại
          </button>
          {step < 4 ? (
            <button type="button" onClick={() => setStep((s) => s + 1)} className="admin-btn-gold">
              Bước tiếp theo
            </button>
          ) : (
            <button type="button" onClick={handleSubmit} className="admin-btn-gold">
              Xác nhận & Đăng tin
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

