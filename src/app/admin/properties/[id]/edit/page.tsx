"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, MapPin, Upload, X } from "lucide-react";

const THEME_COLOR = "#F5D060";

const AMENITIES_OPTIONS = [
  "Wifi", "Hồ bơi", "Bãi đỗ xe", "Bữa sáng", "Điều hòa", "Spa", "View biển", "Gym", "Bar", "Phòng họp",
];

export default function EditPropertyPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params?.id);
  const [hotel, setHotel] = useState<{
    id: number;
    name: string;
    location: string;
    address?: string;
    description: string;
    image: string;
    images: string[];
    rawPrice: number;
    amenities: string[];
    maxGuests?: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [pricePerNight, setPricePerNight] = useState("");
  const [maxGuests, setMaxGuests] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    fetch(`/api/properties/${id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        setHotel(data);
        if (data) {
          setName(data.name);
          setLocation(data.location ?? "");
          setAddress(data.address ?? "");
          setDescription(data.description ?? "");
          const imgs = data.images?.length ? data.images : (data.image ? [data.image] : []);
          setImagePreviews(imgs);
          setAmenities(data.amenities ?? []);
          setPricePerNight(String(data.rawPrice ?? 0));
          setMaxGuests(String(data.maxGuests ?? 2));
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-slate-500">Đang tải...</div>
    );
  }

  if (!hotel) {
    return (
      <div className="max-w-4xl mx-auto py-12">
        <p className="text-slate-500">Không tìm thấy chỗ nghỉ.</p>
        <Link href="/admin/properties" className="text-sm font-semibold mt-4 inline-block" style={{ color: THEME_COLOR }}>
          ← Quay lại danh sách
        </Link>
      </div>
    );
  }

  const inputClass = "w-full p-3 border rounded-xl outline-none focus:ring-2 border-slate-200";
  const focusRing = { ["--tw-ring-color" as string]: THEME_COLOR };

  const toggleAmenity = (a: string) => {
    setAmenities((prev) =>
      prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]
    );
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/properties/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          location,
          address,
          description,
          images: imagePreviews,
          image: imagePreviews[0] || hotel.image,
          rawPrice: Number(pricePerNight) || 0,
          amenities,
          maxGuests: Number(maxGuests) || 2,
        }),
      });
      if (res.ok) router.push("/admin/properties");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/admin/properties" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <ChevronLeft size={24} />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Chỉnh sửa chỗ nghỉ</h2>
          <p className="text-sm text-slate-500">{hotel.name}</p>
        </div>
      </div>

      <div className="flex justify-between items-center px-12 relative mb-8">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2 -z-10" />
        <div
          className="absolute top-1/2 left-0 h-1 -translate-y-1/2 -z-10 transition-all duration-500"
          style={{ width: `${((step - 1) / 3) * 100}%`, backgroundColor: THEME_COLOR }}
        />
        {[1, 2, 3, 4].map((s) => (
          <div
            key={s}
            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all ${
              step >= s ? "bg-slate-900 border-slate-900 text-white" : "bg-white border-slate-200 text-slate-400"
            }`}
          >
            {s}
          </div>
        ))}
      </div>

      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm min-h-[400px]">
        {step === 1 && (
          <div className="space-y-6">
            <h4 className="font-bold text-lg flex items-center gap-2"><MapPin size={20} /> Thông tin & Vị trí</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-1">
                <label className="text-sm font-semibold text-slate-700">Tên chỗ nghỉ</label>
                <input type="text" className={inputClass} style={focusRing} value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="col-span-2 space-y-1">
                <label className="text-sm font-semibold text-slate-700">Vị trí (hiển thị)</label>
                <input type="text" className={inputClass} style={focusRing} value={location} onChange={(e) => setLocation(e.target.value)} placeholder="VD: Sơn Trà, Đà Nẵng" />
              </div>
              <div className="col-span-2 space-y-1">
                <label className="text-sm font-semibold text-slate-700">Mô tả</label>
                <textarea className={inputClass + " h-32"} style={focusRing} value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 py-4">
            <h4 className="font-bold text-lg">Hình ảnh</h4>
            <div className="flex flex-wrap gap-4">
              {imagePreviews.map((url, i) => (
                <img key={i} src={url} alt="" className="w-28 h-28 object-cover rounded-xl border" />
              ))}
            </div>
            <p className="text-sm text-slate-500">Để thay ảnh, tích hợp API upload (Cloudinary, S3, ...) tại đây.</p>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h4 className="font-bold text-lg">Tiện ích</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {AMENITIES_OPTIONS.map((name) => (
                <label key={name} className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer ${amenities.includes(name) ? "border-slate-900 bg-slate-50" : ""}`}>
                  <input type="checkbox" checked={amenities.includes(name)} onChange={() => toggleAmenity(name)} className="w-5 h-5 rounded" style={{ accentColor: THEME_COLOR }} />
                  <span className="text-sm font-semibold text-slate-700">{name}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4 max-w-md">
            <h4 className="font-bold text-lg">Giá & Chính sách</h4>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Giá/đêm (VNĐ)</label>
              <div className="relative">
                <input type="number" className={inputClass + " pr-12"} style={focusRing} value={pricePerNight} onChange={(e) => setPricePerNight(e.target.value)} />
                <span className="absolute right-4 top-3 text-slate-400 font-bold">₫</span>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Số khách tối đa</label>
              <input type="number" className={inputClass} style={focusRing} value={maxGuests} onChange={(e) => setMaxGuests(e.target.value)} />
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between">
        <button disabled={step === 1} onClick={() => setStep((s) => s - 1)} className="px-6 py-3 rounded-xl font-bold text-slate-600 hover:bg-white border hover:border-slate-200 disabled:opacity-30">
          Quay lại
        </button>
        {step < 4 ? (
          <button onClick={() => setStep((s) => s + 1)} style={{ backgroundColor: THEME_COLOR }} className="px-10 py-3 text-slate-900 rounded-xl font-bold hover:brightness-95 shadow-lg">
            Bước tiếp theo
          </button>
        ) : (
          <button onClick={() => void handleSubmit()} disabled={saving} style={{ backgroundColor: THEME_COLOR }} className="px-10 py-3 text-slate-900 rounded-xl font-bold hover:brightness-95 shadow-lg disabled:opacity-70">
            {saving ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        )}
      </div>
    </div>
  );
}
