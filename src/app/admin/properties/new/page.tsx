"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, MapPin, Upload, X, ImageIcon, Sparkles, Banknote } from "lucide-react";

const STEPS = [
  { num: 1, label: "Thông tin & Vị trí", icon: MapPin },
  { num: 2, label: "Hình ảnh", icon: ImageIcon },
  { num: 3, label: "Tiện ích", icon: Sparkles },
  { num: 4, label: "Giá & Chính sách", icon: Banknote },
];

const GENERAL_AMENITIES = [
  "Air conditioner", "Balcony", "Cable TV", "Heater", "Smoking", "Washing machine", "Wi Fi", "Lift"
];
const OUTDOOR_AMENITIES = [
  "Restaurant", "Shop", "Bus", "Park", "Playground", "Tennis court", "BBQ area", "Parking", "Gym"
];

interface FormData {
  name: string;
  category: string;
  badge: string;
  province: string;
  district: string;
  ward: string;
  address: string;
  description: string;
  images: (File | string)[];
  imagePreviews: string[];
  amenities: string[];
  pricePerNight: string;
  priceType: string;
  maxGuests: string;
  status: "available" | "unavailable";
  specsBedrooms: string;
  specsBathrooms: string;
  specsArea: string;
}

const emptyForm: FormData = {
  name: "",
  category: "",
  badge: "",
  province: "",
  district: "",
  ward: "",
  address: "",
  description: "",
  images: [],
  imagePreviews: [],
  amenities: [],
  pricePerNight: "",
  priceType: "month",
  maxGuests: "",
  status: "available",
  specsBedrooms: "",
  specsBathrooms: "",
  specsArea: "",
};

interface GeoItem {
  code: number;
  name: string;
  districts?: { code: number; name: string }[];
  wards?: { code: number; name: string }[];
}

function FieldLabel({ icon: Icon, children }: { icon?: React.ElementType; children: React.ReactNode }) {
  return (
    <label className="admin-form-label">
      {Icon && <Icon size={13} />}
      {children}
    </label>
  );
}

export default function NewPropertyPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [provinces, setProvinces] = useState<GeoItem[]>([]);
  const [districts, setDistricts] = useState<GeoItem[]>([]);
  const [wards, setWards] = useState<GeoItem[]>([]);
  const [uploadingCount, setUploadingCount] = useState(0);
  const [imageError, setImageError] = useState("");

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

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageError("");
    const files = e.target.files;
    if (!files?.length) return;
    const newFiles = Array.from(files).slice(0, 10 - form.imagePreviews.length);
    if (!newFiles.length) return;
    // Show blob previews immediately for good UX
    const blobPreviews = newFiles.map((f) => URL.createObjectURL(f));
    setForm((prev) => ({
      ...prev,
      images: [...prev.images, ...newFiles],
      imagePreviews: [...prev.imagePreviews, ...blobPreviews],
    }));
    // Upload each file and replace blob URL with server path
    setUploadingCount((c) => c + newFiles.length);
    await Promise.all(
      newFiles.map(async (file, idx) => {
        try {
          const fd = new FormData();
          fd.append("file", file);
          const res = await fetch("/api/upload/image", { method: "POST", body: fd });
          const json = await res.json();
          if (json.url) {
            const serverUrl = json.url as string;
            setForm((prev) => {
              const blobUrl = blobPreviews[idx];
              const newPreviews = prev.imagePreviews.map((u) => (u === blobUrl ? serverUrl : u));
              URL.revokeObjectURL(blobUrl);
              return { ...prev, imagePreviews: newPreviews, images: newPreviews.map(() => "") };
            });
          }
        } catch {
          // keep blob preview if upload fails
        } finally {
          setUploadingCount((c) => c - 1);
        }
      })
    );
    e.target.value = "";
  };

  const removeImage = (index: number) => {
    const preview = form.imagePreviews[index];
    if (typeof preview === "string" && preview.startsWith("blob:")) URL.revokeObjectURL(preview);
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
    if (form.imagePreviews.length === 0) {
      setStep(2);
      setImageError("Vui lòng tải lên ít nhất 1 ảnh cho căn hộ.");
      return;
    }
    const slug = form.name
      ? form.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/g, "")
      : `property-${Date.now()}`;
    const provinceName = provinces.find((p) => String(p.code) === form.province)?.name ?? "";
    const districtName = districts.find((d) => String(d.code) === form.district)?.name ?? "";
    const wardName = wards.find((w) => String(w.code) === form.ward)?.name ?? "";
    const locationStr = [provinceName, districtName, wardName].filter(Boolean).join(", ") || form.address;
    // Only use real server paths (not blob: URLs)
    const imageUrls = form.imagePreviews.filter((p): p is string => typeof p === "string" && !p.startsWith("blob:"));
    const res = await fetch("/api/properties", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slug: slug || `property-${Date.now()}`,
        name: form.name,
        category: form.category.trim(),
        badge: form.badge.trim(),
        location: locationStr,
        province: provinceName,
        district: districtName,
        ward: wardName,
        address: form.address,
        description: form.description,
        image: imageUrls[0] || "",
        images: imageUrls,
        rawPrice: Number(form.pricePerNight) || 0,
        priceType: form.priceType,
        status: form.status,
        amenities: form.amenities,
        specs: {
          bedrooms: form.specsBedrooms,
          bathrooms: form.specsBathrooms,
          area: form.specsArea,
        },
        maxGuests: Number(form.maxGuests) || 2,
      }),
    });
    if (res.ok) router.push("/admin/properties");
  };

  return (
    <div className="admin-form-root">
      <div className="admin-form-header">
        <Link href="/admin/properties" className="admin-form-back" aria-label="Quay lại">
          <ChevronLeft size={18} />
        </Link>
        <div>
          <h1 className="admin-form-title">Đăng căn hộ mới</h1>
          <p className="admin-form-subtitle">Hoàn thành 4 bước để đưa tài sản lên NineHousing</p>
        </div>
      </div>

      <div className="admin-form-steps">
        {STEPS.map(({ num, label, icon: Icon }) => {
          const isActive = step === num;
          const isDone = step > num;
          return (
            <button
              key={num}
              type="button"
              className={`admin-form-step${isActive ? " active" : ""}${isDone ? " done" : ""}`}
              onClick={() => setStep(num)}
              aria-current={isActive ? "step" : undefined}
            >
              <Icon size={13} />
              {label}
            </button>
          );
        })}
      </div>

      <div className="admin-form-card">
        <div className="admin-form-card-header">
          {React.createElement(STEPS[step - 1].icon, { size: 14, style: { color: "var(--a-gold)" } })}
          <span className="admin-form-card-header-title">{STEPS[step - 1].label}</span>
          <div className="admin-form-card-header-dot" />
        </div>
        <div className="admin-form-card-body" style={{ minHeight: "320px" }}>
          {step === 1 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div className="admin-form-field">
                <FieldLabel icon={MapPin}>Tên căn hộ</FieldLabel>
                <input
                  type="text"
                  className="admin-form-title-input"
                  placeholder="VD: Apartment 401, 9/29 Nguyen Chi Thanh Str"
                  value={form.name}
                  onChange={(e) => update({ name: e.target.value })}
                />
              </div>
              <div className="admin-form-field">
                <FieldLabel>Danh mục</FieldLabel>
                <input
                  type="text"
                  className="admin-form-input"
                  placeholder="VD: Căn hộ, Biệt thự, Nhà phố"
                  value={form.category}
                  onChange={(e) => update({ category: e.target.value })}
                />
              </div>
              <div className="admin-form-field">
                <FieldLabel>Badge (hiển thị trên thẻ)</FieldLabel>
                <input
                  type="text"
                  className="admin-form-input"
                  placeholder="VD: Nổi bật, Giảm 20%, Mới"
                  value={form.badge}
                  onChange={(e) => update({ badge: e.target.value })}
                />
              </div>
              <div className="admin-form-row2">
                <div className="admin-form-field">
                  <FieldLabel>Tỉnh / Thành phố</FieldLabel>
                  <select
                    value={form.province}
                    onChange={(e) => {
                      update({ province: e.target.value, district: "", ward: "" });
                      loadDistricts(e.target.value);
                    }}
                    className="admin-form-select"
                  >
                    <option value="">Chọn Tỉnh/Thành</option>
                    {provinces.map((p) => (
                      <option key={p.code} value={p.code}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div className="admin-form-field">
                  <FieldLabel>Quận / Huyện</FieldLabel>
                  <select
                    disabled={!form.province}
                    value={form.district}
                    onChange={(e) => {
                      update({ district: e.target.value, ward: "" });
                      loadWards(e.target.value);
                    }}
                    className="admin-form-select"
                  >
                    <option value="">Chọn Quận/Huyện</option>
                    {districts.map((d) => (
                      <option key={d.code} value={d.code}>{d.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="admin-form-field">
                <FieldLabel>Phường / Xã</FieldLabel>
                <select
                  disabled={!form.district}
                  value={form.ward}
                  onChange={(e) => update({ ward: e.target.value })}
                  className="admin-form-select"
                >
                  <option value="">Chọn Phường/Xã</option>
                  {wards.map((w) => (
                    <option key={w.code} value={w.code}>{w.name}</option>
                  ))}
                </select>
              </div>
              <div className="admin-form-field">
                <FieldLabel>Địa chỉ cụ thể</FieldLabel>
                <input
                  type="text"
                  className="admin-form-input"
                  placeholder="Số nhà, tên đường..."
                  value={form.address}
                  onChange={(e) => update({ address: e.target.value })}
                />
              </div>
              <div className="admin-form-field">
                <FieldLabel>Mô tả chi tiết</FieldLabel>
                <textarea
                  className="admin-form-input"
                  style={{ minHeight: "100px" }}
                  placeholder="Giới thiệu về căn hộ, dịch vụ..."
                  value={form.description}
                  onChange={(e) => update({ description: e.target.value })}
                />
              </div>
              <div className="admin-form-row2">
                <div className="admin-form-field">
                  <FieldLabel>Phòng ngủ</FieldLabel>
                  <input
                    type="number"
                    className="admin-form-input"
                    placeholder="VD: 1"
                    value={form.specsBedrooms}
                    onChange={(e) => update({ specsBedrooms: e.target.value })}
                  />
                </div>
                <div className="admin-form-field">
                  <FieldLabel>Phòng tắm</FieldLabel>
                  <input
                    type="number"
                    className="admin-form-input"
                    placeholder="VD: 1"
                    value={form.specsBathrooms}
                    onChange={(e) => update({ specsBathrooms: e.target.value })}
                  />
                </div>
              </div>
              <div className="admin-form-field" style={{ maxWidth: "160px" }}>
                <FieldLabel>Diện tích (m²)</FieldLabel>
                <input
                  type="number"
                  className="admin-form-input"
                  placeholder="VD: 60"
                  value={form.specsArea}
                  onChange={(e) => update({ specsArea: e.target.value })}
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {imageError && (
                <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "8px", padding: "10px 14px", color: "#dc2626", fontSize: "13px", fontWeight: 500 }}>
                  <span>⚠️</span> {imageError}
                </div>
              )}
              {form.imagePreviews.length === 0 ? (
                <label className="admin-form-upload-zone">
                  <div className="admin-form-upload-icon">
                    <Upload size={22} />
                  </div>
                  <div className="admin-form-upload-title">Kéo thả ảnh vào đây hoặc nhấn để chọn</div>
                  <div className="admin-form-upload-sub">Tối đa 10 ảnh · PNG, JPG · 5MB/ảnh</div>
                  <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageChange} />
                </label>
              ) : (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
                  {form.imagePreviews.map((url, i) => (
                    <div key={i} className="admin-form-img-preview" style={{ width: "120px", maxHeight: "120px" }}>
                      <img src={url} alt="" style={{ maxHeight: "120px", objectFit: "cover" }} />
                      {i === 0 && (
                        <span style={{ position: "absolute", bottom: "6px", left: "6px", fontSize: "10px", fontWeight: 800, background: "#0f172a", color: "white", padding: "2px 6px", borderRadius: "6px" }}>
                          Đại diện
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="admin-form-img-remove"
                        aria-label="Xóa ảnh"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  {form.imagePreviews.length < 10 && (
                    <label className="admin-form-upload-zone" style={{ width: "120px", minHeight: "120px", padding: "16px" }}>
                      <Upload size={24} style={{ color: "var(--a-gold)" }} />
                      <span className="admin-form-upload-sub">Thêm ảnh</span>
                      <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageChange} />
                    </label>
                  )}
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <p className="admin-form-label" style={{ textTransform: "none", marginBottom: 4 }}>General Amenities</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "10px" }}>
                {GENERAL_AMENITIES.map((name) => {
                  const selected = form.amenities.includes(name);
                  return (
                    <label key={name} className={`admin-form-chip${selected ? " selected" : ""}`}>
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={() => toggleAmenity(name)}
                      />
                      <span>{name}</span>
                    </label>
                  );
                })}
              </div>
              <p className="admin-form-label" style={{ textTransform: "none", marginBottom: 4, marginTop: 8 }}>Outdoor facilities</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "10px" }}>
                {OUTDOOR_AMENITIES.map((name) => {
                  const selected = form.amenities.includes(name);
                  return (
                    <label key={name} className={`admin-form-chip${selected ? " selected" : ""}`}>
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={() => toggleAmenity(name)}
                      />
                      <span>{name}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {step === 4 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px", maxWidth: "400px" }}>
              <div style={{ display: "flex", gap: "16px", alignItems: "flex-end" }}>
                <div className="admin-form-field" style={{ flex: 1 }}>
                  <FieldLabel icon={Banknote}>Giá thuê ($)</FieldLabel>
                  <div className="admin-form-slug-wrap">
                    <span className="admin-form-slug-prefix">$</span>
                    <input
                      type="number"
                      className="admin-form-input slug"
                      style={{ paddingLeft: "36px" }}
                      placeholder="0"
                      value={form.pricePerNight}
                      onChange={(e) => update({ pricePerNight: e.target.value })}
                    />
                  </div>
                </div>
                <div className="admin-form-field" style={{ width: "140px" }}>
                  <FieldLabel>Thuê theo</FieldLabel>
                  <select
                    value={form.priceType}
                    onChange={(e) => update({ priceType: e.target.value })}
                    className="admin-form-select"
                  >
                    <option value="month">Tháng</option>
                    <option value="day">Ngày</option>
                  </select>
                </div>
              </div>
              <div className="admin-form-field">
                <FieldLabel>Số khách tối đa</FieldLabel>
                <input
                  type="number"
                  className="admin-form-input"
                  placeholder="VD: 4"
                  value={form.maxGuests}
                  onChange={(e) => update({ maxGuests: e.target.value })}
                />
              </div>
              <div className="admin-form-field">
                <FieldLabel>Trạng thái</FieldLabel>
                <select
                  value={form.status}
                  onChange={(e) => update({ status: e.target.value as "available" | "unavailable" })}
                  className="admin-form-select"
                >
                  <option value="available">Available (đang cho thuê)</option>
                  <option value="unavailable">Unavailable (tạm ngừng)</option>
                </select>
              </div>
            </div>
          )}
        </div>

        <div className="admin-form-actions" style={{ marginTop: 0, padding: "16px 24px", borderTop: "1px solid #f1f5f9" }}>
          <button
            type="button"
            disabled={step === 1}
            onClick={() => setStep((s) => s - 1)}
            className="admin-btn-ghost"
            style={{ opacity: step === 1 ? 0.5 : 1, cursor: step === 1 ? "not-allowed" : "pointer" }}
          >
            Quay lại
          </button>
          {step < 4 ? (
            <button
              type="button"
              onClick={() => {
                if (step === 2 && form.imagePreviews.length === 0) {
                  setImageError("Vui lòng tải lên ít nhất 1 ảnh cho căn hộ.");
                  return;
                }
                setImageError("");
                setStep((s) => s + 1);
              }}
              className="admin-form-submit"
            >
              Bước tiếp theo
            </button>
          ) : (
            <button type="button" onClick={handleSubmit} disabled={uploadingCount > 0} className="admin-form-submit" style={{ opacity: uploadingCount > 0 ? 0.6 : 1 }}>
              {uploadingCount > 0 ? `Đang tải ảnh (${uploadingCount})...` : "Xác nhận & Đăng tin"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
