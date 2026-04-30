import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useAuthStore } from "../../../auth/authStore";
import Avatar from "../../../../components/ui/Avatar";
import api from "../../../../lib/api";
import type {
  BarberShopProfile,
  BarberShopImageResponse,
} from "../../types/settings.types";
import ToggleSwitch from "./ToggleSwitch";
import UploadImagesModal from "./UploadImagesModal";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSection?: "shop" | "gallery" | "privacy";
}

type Section = "shop" | "gallery" | "privacy";
type ShopStatus = "ACTIVO" | "INACTIVO";

const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  initialSection = "shop",
}) => {
  const [shopStatus, setShopStatus] = useState<ShopStatus>("INACTIVO");
  const [statusLoading, setStatusLoading] = useState(false);
  const [statusError, setStatusError] = useState<string | null>(null);
  const [statusSuccess, setStatusSuccess] = useState(false);

  const [activeSection, setActiveSection] = useState<Section>(initialSection);
  const { user, setCoverImageUrl, setBarberShopName } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Gallery states
  const [images, setImages] = useState<BarberShopImageResponse[]>([]);
  const [galleryLoading, setGalleryLoading] = useState(false);
  const [galleryError, setGalleryError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({
    current: 0,
    total: 0,
    currentFileIndex: 0,
    totalFiles: 0,
  });
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Shop section states
  const [shopData, setShopData] = useState<BarberShopProfile | null>(null);
  const [shopLoading, setShopLoading] = useState(false);
  const [shopError, setShopError] = useState<string | null>(null);
  const [shopSaving, setShopSaving] = useState(false);
  const [shopSuccess, setShopSuccess] = useState(false);

  const [shopForm, setShopForm] = useState({
    barberShopName: "",
    address: "",
    city: "",
    department: "",
    barberShopPhone: "",
    firstName: "",
    lastName: "",
    userPhone: "",
    email: "",
  });
  const [shopFormOriginal, setShopFormOriginal] = useState({ ...shopForm });

  // Password section states
  const [pwForm, setPwForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [pwLoading, setPwLoading] = useState(false);
  const [pwError, setPwError] = useState<string | null>(null);
  const [pwSuccess, setPwSuccess] = useState(false);
  const [showPw, setShowPw] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  useEffect(() => {
    if (activeSection === "shop" && shopData === null && isOpen) {
      fetchShopData();
    }
    if (activeSection === "gallery" && isOpen) {
      fetchImages();
    }
  }, [activeSection, shopData, isOpen]);

  const fetchImages = async () => {
    setGalleryLoading(true);
    setGalleryError(null);
    try {
      const { data } = await api.get<BarberShopImageResponse[]>(
        "/api/barbershop/images",
      );
      setImages(data);
    } catch (err: any) {
      setGalleryError(
        err.response?.data?.message || "Failed to load gallery images.",
      );
    } finally {
      setGalleryLoading(false);
    }
  };

  const handleImageUpload = async (files: File[]) => {
    if (!files || files.length === 0) return;

    // Check total limit (already checked in Modal, but for safety)
    if (images.length + files.length > 5) {
      alert("Maximum 5 images allowed in gallery.");
      return;
    }

    setUploading(true);
    setGalleryError(null);
    setIsUploadModalOpen(false);

    setUploadProgress({
      current: 0,
      total: 0,
      currentFileIndex: 0,
      totalFiles: files.length,
    });

    // Check if there is already a cover image in the current list
    const hasExistingCover = images.some((img) => img.cover);

    try {
      for (let i = 0; i < files.length; i++) {
        setUploadProgress((prev) => ({
          ...prev,
          currentFileIndex: i + 1,
          current: 0,
        }));

        const formData = new FormData();
        formData.append("file", files[i]);

        const { data } = await api.post<BarberShopImageResponse>(
          "/api/barbershop/images/upload",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
            onUploadProgress: (progressEvent) => {
              if (progressEvent.total) {
                const percentCompleted = Math.round(
                  (progressEvent.loaded * 100) / progressEvent.total,
                );
                setUploadProgress((prev) => ({
                  ...prev,
                  current: percentCompleted,
                }));
              }
            },
          },
        );

        // Incremental state update
        setImages((prev) => [...prev, data]);

        // ONLY set as cover if the gallery was COMPLETELY empty before this batch
        // and it's the first image of this batch.
        // This ensures existing avatars/covers are never removed/replaced by a new upload
        // unless there was nothing there.
        if (!hasExistingCover && i === 0 && images.length === 0) {
          try {
            await api.post(`/api/barbershop/images/${data.id}/cover`);
            setCoverImageUrl(data.imageUrl);
            // Update local state for cover
            setImages((prev) =>
              prev.map((img) => ({
                ...img,
                cover: img.id === data.id,
              })),
            );
          } catch (coverErr) {
            console.error("Failed to set initial cover:", coverErr);
          }
        }

        // Small delay for UX to show 100% progress
        await new Promise((resolve) => setTimeout(resolve, 300));
      }
    } catch (err: any) {
      setGalleryError(
        err.response?.data?.message || "Failed to upload images.",
      );
    } finally {
      setUploading(false);
      setUploadProgress({
        current: 0,
        total: 0,
        currentFileIndex: 0,
        totalFiles: 0,
      });
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDeleteImage = async (id: number) => {
    if (!confirm("Are you sure you want to delete this image?")) return;

    setGalleryLoading(true);
    try {
      await api.delete(`/api/barbershop/images/${id}`);
      setImages((prev) => prev.filter((img) => img.id !== id));
    } catch (err: any) {
      setGalleryError(err.response?.data?.message || "Failed to delete image.");
    } finally {
      setGalleryLoading(false);
    }
  };

  const handleSetCover = async (id: number) => {
    setGalleryLoading(true);
    try {
      await api.post(`/api/barbershop/images/${id}/cover`);

      // Find the image to get its URL
      const newCoverImage = images.find((img) => img.id === id);
      if (newCoverImage) {
        setCoverImageUrl(newCoverImage.imageUrl);
      }

      // Update local gallery state
      setImages((prev) =>
        prev.map((img) => ({
          ...img,
          cover: img.id === id,
        })),
      );
    } catch (err: any) {
      setGalleryError(
        err.response?.data?.message || "Failed to set image as cover.",
      );
    } finally {
      setGalleryLoading(false);
    }
  };

  const fetchShopData = async () => {
    setShopLoading(true);
    setShopError(null);
    try {
      const { data } = await api.get("/auth/me");

      const formData = {
        barberShopName: data.barberShopName ?? "",
        address: data.address ?? "",
        city: data.city ?? "",
        department: data.department ?? "",
        barberShopPhone: data.phone ?? "",
        firstName: data.given_name ?? "",
        lastName: data.family_name ?? "",
        userPhone: data.phone_number ?? "",
        email: data.email ?? "",
      };

      setShopForm(formData);
      setShopFormOriginal(formData);
      setShopData(data);
      setShopStatus(data.status ?? "INACTIVO");
    } catch (err: any) {
      setShopError(err.response?.data?.message || "Failed to load shop data.");
    } finally {
      setShopLoading(false);
    }
  };
  const handleShopSave = async () => {
    setShopSaving(true);
    setShopError(null);
    setShopSuccess(false);

    const [shopResult, userResult] = await Promise.allSettled([
      api.put("/api/barbershop", {
        barberShopName: shopForm.barberShopName,
        address: shopForm.address,
        barberShopPhone: shopForm.barberShopPhone,
        city: shopForm.city,
        department: shopForm.department,
      }),
      api.put("/api/users/me", {
        firstName: shopForm.firstName,
        lastName: shopForm.lastName,
        phone: shopForm.userPhone,
      }),
    ]);

    const shopFailed = shopResult.status === "rejected";
    const userFailed = userResult.status === "rejected";

    if (shopFailed && userFailed) {
      setShopError("Failed to save both shop and user data. Please try again.");
    } else if (shopFailed) {
      setShopError("Shop info failed to save. User info was updated.");
    } else if (userFailed) {
      setShopError("User info failed to save. Shop info was updated.");
    } else {
      setShopFormOriginal({ ...shopForm });
      setBarberShopName(shopForm.barberShopName);
      setShopSuccess(true);
      setTimeout(() => setShopSuccess(false), 3000);
    }

    setShopSaving(false);
  };

  const handleShopDiscard = () => {
    setShopForm({ ...shopFormOriginal });
    setShopError(null);
    setShopSuccess(false);
  };

  const handlePasswordUpdate = async () => {
    if (pwForm.newPassword !== pwForm.confirmNewPassword) {
      setPwError("New passwords do not match.");
      return;
    }
    if (pwForm.newPassword.length < 8) {
      setPwError("Password must be at least 8 characters long.");
      return;
    }

    setPwLoading(true);
    setPwError(null);
    setPwSuccess(false);

    try {
      await api.patch("/api/auth/change-password", {
        currentPassword: pwForm.currentPassword,
        newPassword: pwForm.newPassword,
        confirmNewPassword: pwForm.confirmNewPassword,
      });

      setPwForm({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
      setPwSuccess(true);
      setTimeout(() => setPwSuccess(false), 3000);
    } catch (err: any) {
      console.error("Error updating password:", err);
      setPwError(err.response?.data?.message || "Failed to update password.");
    } finally {
      setPwLoading(false);
    }
  };

  const handleShopStatusChange = async (newStatus: ShopStatus) => {
    setStatusLoading(true);
    setStatusError(null);
    setStatusSuccess(false);

    try {
      const endpoint =
        newStatus === "ACTIVO"
          ? "/api/barbershop/activate"
          : "/api/barbershop/desactivate";

      await api.put(endpoint);

      setShopStatus(newStatus);
      setStatusSuccess(true);
      setTimeout(() => setStatusSuccess(false), 3000);
    } catch (err: any) {
      setStatusError(
        err.response?.data?.message || "Failed to update shop status.",
      );
    } finally {
      setStatusLoading(false);
    }
  };

  if (!isOpen) return null;

  const role = user?.roles?.[0]?.replace("ROLE_", "") ?? "Admin";

  const renderSidebar = () => (
    <aside
      className={`
    bg-[#0e0e0e]
    h-full
    w-72
    flex-shrink-0
    flex flex-col
    py-10 px-6
    font-['Manrope']
    tracking-tight
    border-r border-white/5

    fixed md:relative
    z-40 md:z-auto

    transition-transform duration-300
    ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
    md:translate-x-0
  `}
    >
      <button
        onClick={() => setSidebarOpen(false)}
        className="md:hidden absolute top-6 right-6 text-[#e5e2e1]"
      >
        <span className="material-symbols-outlined">close</span>
      </button>

      <div className="flex items-center gap-4 mb-12 px-2">
        <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border-2 border-[#f2ca50] bg-[#2a2a2a] flex items-center justify-center">
          <span className="material-symbols-outlined text-[#f2ca50] text-2xl">
            content_cut
          </span>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-[#f2ca50]">
            {shopForm.barberShopName || "My Barbershop"}
          </h2>
          <p className="text-[10px] uppercase tracking-widest text-[#d0c5af] opacity-60">
            Management Settings
          </p>
        </div>
      </div>

      <nav className="flex-grow space-y-2 mb-6">
        <button
          onClick={() => {
            setActiveSection("shop");
            setSidebarOpen(false);
          }}
          className={`w-full flex items-center gap-3 px-5 py-4 transition-all active:scale-95 duration-150 rounded-full ${
            activeSection === "shop"
              ? "text-[#f2ca50] bg-[#1c1b1b]"
              : "text-[#e5e2e1] opacity-70 hover:bg-[#2a2a2a] hover:opacity-100"
          }`}
        >
          <span className="material-symbols-outlined">storefront</span>
          <span
            className={
              activeSection === "shop" ? "font-semibold" : "font-medium"
            }
          >
            Shop Information
          </span>
        </button>

        <button
          onClick={() => {
            setActiveSection("gallery");
            setSidebarOpen(false);
          }}
          className={`w-full flex items-center gap-3 px-5 py-4 transition-all active:scale-95 duration-150 rounded-full ${
            activeSection === "gallery"
              ? "text-[#f2ca50] bg-[#1c1b1b]"
              : "text-[#e5e2e1] opacity-70 hover:bg-[#2a2a2a] hover:opacity-100"
          }`}
        >
          <span className="material-symbols-outlined">gallery_thumbnail</span>
          <span
            className={
              activeSection === "gallery" ? "font-semibold" : "font-medium"
            }
          >
            Gallery
          </span>
        </button>

        <button
          onClick={() => {
            setActiveSection("privacy");
            setSidebarOpen(false);
          }}
          className={`w-full flex items-center gap-3 px-5 py-4 transition-all active:scale-95 duration-150 rounded-full ${
            activeSection === "privacy"
              ? "text-[#f2ca50] bg-[#1c1b1b]"
              : "text-[#e5e2e1] opacity-70 hover:bg-[#2a2a2a] hover:opacity-100"
          }`}
        >
          <span className="material-symbols-outlined">security</span>
          <span
            className={
              activeSection === "privacy" ? "font-semibold" : "font-medium"
            }
          >
            Privacy & Security
          </span>
        </button>
      </nav>

      <div className="mt-auto px-4 py-4 rounded-2xl bg-[#1c1b1b]/50 border border-white/5">
        <p className="text-[10px] text-[#d0c5af]/60 uppercase tracking-widest mb-2">
          Logged in as {role}
        </p>
        <div className="flex items-center gap-3">
          <Avatar
            name={user?.name ?? "Admin"}
            size="sm"
            src={user?.coverImageUrl}
          />
          <span className="text-sm font-medium text-[#e5e2e1]">
            {user?.name ?? "Admin"}
          </span>
        </div>
      </div>
    </aside>
  );

  const renderShopInfo = () => (
    <div className="px-8 md:px-12 py-20 md:py-8 max-w-4xl mx-auto w-full">
      <div className="mb-12">
        <h1 className="text-4xl font-extrabold text-[#e5e2e1] tracking-tight mb-2 font-['Manrope']">
          Settings
        </h1>
        <p className="text-[#d0c5af] text-lg">
          Manage your shop profile and public appearance
        </p>
      </div>

      {shopLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <span className="material-symbols-outlined text-5xl text-[#f2ca50] animate-spin">
            progress_activity
          </span>
          <p className="text-[#d0c5af] text-sm font-medium">
            Loading shop data...
          </p>
        </div>
      ) : shopError && !shopForm.barberShopName ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <span className="material-symbols-outlined text-5xl text-red-400">
            error
          </span>
          <p className="text-red-400 text-sm font-medium">{shopError}</p>
          <button
            onClick={fetchShopData}
            className="px-6 py-2 bg-[#2a2a2a] text-[#f2ca50] text-sm font-bold rounded-full hover:bg-[#353535] transition-colors"
          >
            Retry
          </button>
        </div>
      ) : (
        <div className="space-y-12 pb-20">
          {shopSuccess && (
            <div className="bg-green-500/10 border border-green-500/20 text-green-400 px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">
                check_circle
              </span>
              Changes saved successfully
            </div>
          )}
          {shopError && shopForm.barberShopName && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">error</span>
              {shopError}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="block text-[10px] uppercase tracking-widest text-[#f2ca50] font-bold ml-1">
                Shop Name
              </label>
              <input
                className="w-full bg-[#201f1f] border-none rounded-full px-6 py-4 text-[#e5e2e1] focus:ring-2 focus:ring-[#f2ca50]/50 placeholder:text-[#d0c5af]/30 outline-none"
                type="text"
                value={shopForm.barberShopName}
                onChange={(e) =>
                  setShopForm((prev) => ({
                    ...prev,
                    barberShopName: e.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] uppercase tracking-widest text-[#f2ca50] font-bold ml-1">
                Shop Phone
              </label>
              <input
                className="w-full bg-[#201f1f] border-none rounded-full px-6 py-4 text-[#e5e2e1] focus:ring-2 focus:ring-[#f2ca50]/50 outline-none"
                type="tel"
                value={shopForm.barberShopPhone}
                onChange={(e) =>
                  setShopForm((prev) => ({
                    ...prev,
                    barberShopPhone: e.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] uppercase tracking-widest text-[#f2ca50] font-bold ml-1">
                Owner First Name
              </label>
              <input
                className="w-full bg-[#201f1f] border-none rounded-full px-6 py-4 text-[#e5e2e1] focus:ring-2 focus:ring-[#f2ca50]/50 outline-none"
                type="text"
                value={shopForm.firstName}
                onChange={(e) =>
                  setShopForm((prev) => ({
                    ...prev,
                    firstName: e.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] uppercase tracking-widest text-[#f2ca50] font-bold ml-1">
                Owner Last Name
              </label>
              <input
                className="w-full bg-[#201f1f] border-none rounded-full px-6 py-4 text-[#e5e2e1] focus:ring-2 focus:ring-[#f2ca50]/50 outline-none"
                type="text"
                value={shopForm.lastName}
                onChange={(e) =>
                  setShopForm((prev) => ({ ...prev, lastName: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] uppercase tracking-widest text-[#f2ca50] font-bold ml-1">
                Owner Phone
              </label>
              <input
                className="w-full bg-[#201f1f] border-none rounded-full px-6 py-4 text-[#e5e2e1] focus:ring-2 focus:ring-[#f2ca50]/50 outline-none"
                type="tel"
                value={shopForm.userPhone}
                onChange={(e) =>
                  setShopForm((prev) => ({
                    ...prev,
                    userPhone: e.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] uppercase tracking-widest text-[#f2ca50] font-bold ml-1">
                Email Address
              </label>
              <input
                className="w-full bg-[#201f1f] border-none rounded-full px-6 py-4 text-[#e5e2e1] opacity-50 cursor-not-allowed outline-none"
                type="email"
                value={shopForm.email}
                disabled
              />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="block text-[10px] uppercase tracking-widest text-[#f2ca50] font-bold ml-1">
                Shop Address
              </label>
              <div className="relative">
                <input
                  className="w-full bg-[#201f1f] border-none rounded-full px-6 py-4 text-[#e5e2e1] focus:ring-2 focus:ring-[#f2ca50]/50 pr-12 outline-none"
                  type="text"
                  value={shopForm.address}
                  onChange={(e) =>
                    setShopForm((prev) => ({
                      ...prev,
                      address: e.target.value,
                    }))
                  }
                />
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-[#d0c5af]">
                  location_on
                </span>
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] uppercase tracking-widest text-[#f2ca50] font-bold ml-1">
                  Department
                </label>
                <input
                  className="w-full bg-[#201f1f] border-none rounded-full px-6 py-4 text-[#e5e2e1] focus:ring-2 focus:ring-[#f2ca50]/50 outline-none"
                  type="text"
                  value={shopForm.department}
                  onChange={(e) =>
                    setShopForm((prev) => ({
                      ...prev,
                      department: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] uppercase tracking-widest text-[#f2ca50] font-bold ml-1">
                  City
                </label>
                <input
                  className="w-full bg-[#201f1f] border-none rounded-full px-6 py-4 text-[#e5e2e1] focus:ring-2 focus:ring-[#f2ca50]/50 outline-none"
                  type="text"
                  value={shopForm.city}
                  onChange={(e) =>
                    setShopForm((prev) => ({ ...prev, city: e.target.value }))
                  }
                />
              </div>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-center sm:justify-end gap-6 border-t border-white/5">
            <button
              onClick={handleShopDiscard}
              className="w-full sm:w-auto text-[#d0c5af] hover:text-[#e5e2e1] font-medium transition-colors"
            >
              Discard Changes
            </button>
            <button
              onClick={handleShopSave}
              disabled={shopSaving}
              className="w-full sm:w-auto bg-[#f2ca50] text-[#3c2f00] px-10 py-4 rounded-full font-bold text-lg shadow-xl shadow-[#f2ca50]/10 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
            >
              {shopSaving ? (
                <>
                  <span className="material-symbols-outlined text-sm animate-spin">
                    progress_activity
                  </span>
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const renderGallery = () => (
    <div className="flex-1 flex flex-col h-full bg-[#131313] overflow-hidden relative">
      <UploadImagesModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={handleImageUpload}
        currentCount={images.length}
      />

      {uploading && (
        <div className="absolute top-0 left-0 w-full z-[60] animate-in slide-in-from-top duration-300">
          <div className="bg-[#1c1b1b]/95 backdrop-blur-md border-b border-[#f2ca50]/20 p-4 shadow-2xl">
            <div className="max-w-xl mx-auto space-y-3">
              <div className="flex justify-between items-end">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#f2ca50]">
                    Uploading Assets
                  </span>
                  <span className="text-sm font-bold text-[#e5e2e1]">
                    File {uploadProgress.currentFileIndex} of{" "}
                    {uploadProgress.totalFiles}
                  </span>
                </div>
                <span className="text-xl font-black text-[#f2ca50] font-mono">
                  {uploadProgress.current}%
                </span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#f2ca50] to-[#f2ca50]/50 transition-all duration-300 ease-out"
                  style={{ width: `${uploadProgress.current}%` }}
                ></div>
              </div>
              <p className="text-[10px] text-[#d0c5af]/60 font-medium uppercase tracking-widest text-center">
                Processing your request... do not close the window
              </p>
            </div>
          </div>
        </div>
      )}

      <header className="flex justify-between items-center px-8 w-full h-24 bg-transparent font-['Manrope']">
        <div className="flex flex-col">
          <span className="uppercase tracking-widest text-[10px] text-[#f2ca50] font-bold">
            Visual Assets
          </span>
          <h1 className="text-2xl font-black text-[#e5e2e1] uppercase">
            Gallery
          </h1>
        </div>
        <div className="flex items-center gap-4">
          {galleryLoading && !uploading && (
            <span className="material-symbols-outlined text-xl text-[#f2ca50] animate-spin">
              progress_activity
            </span>
          )}
          <span className="text-[10px] uppercase tracking-widest text-[#d0c5af] font-bold">
            {images.length}/5 Images
          </span>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-8 scroll-smooth">
        {galleryError && (
          <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-400 px-6 py-3 rounded-xl text-sm font-bold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">error</span>
              {galleryError}
            </div>
            <button
              onClick={fetchImages}
              className="text-[10px] uppercase tracking-widest font-black underline"
            >
              Retry
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.length < 5 && (
            <div
              onClick={() => !uploading && setIsUploadModalOpen(true)}
              className={`group relative aspect-square rounded-2xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-3 transition-all bg-[#1c1b1b] ${
                uploading
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:border-[#f2ca50]/50 cursor-pointer"
              }`}
            >
              <div className="w-12 h-12 rounded-full bg-[#2a2a2a] flex items-center justify-center text-[#f2ca50] group-hover:scale-110 transition-transform">
                {uploading ? (
                  <span className="material-symbols-outlined text-2xl animate-spin">
                    progress_activity
                  </span>
                ) : (
                  <span className="material-symbols-outlined text-2xl">
                    add
                  </span>
                )}
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#d0c5af]">
                {uploading ? "Uploading..." : "Add New Asset"}
              </span>
            </div>
          )}

          {images.map((img) => (
            <div
              key={img.id}
              className="group relative aspect-square rounded-2xl overflow-hidden bg-[#2a2a2a] shadow-lg"
            >
              <img
                src={img.imageUrl}
                alt="Shop asset"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                <div className="flex justify-between items-center">
                  {!img.cover && (
                    <button
                      onClick={() => handleSetCover(img.id)}
                      className="bg-white/10 backdrop-blur-md text-[#e5e2e1] text-[10px] font-bold py-2 px-4 rounded-full uppercase tracking-wider hover:bg-[#f2ca50] hover:text-[#3c2f00] transition-colors"
                    >
                      Set as Cover
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteImage(img.id)}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-red-500/20 backdrop-blur-md text-red-400 hover:bg-red-500 hover:text-white transition-colors ml-auto"
                  >
                    <span className="material-symbols-outlined text-sm">
                      delete
                    </span>
                  </button>
                </div>
              </div>
              {img.cover && (
                <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1 bg-[#f2ca50] text-[#3c2f00] rounded-full text-[9px] font-black uppercase tracking-widest shadow-xl">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#3c2f00] animate-pulse"></div>
                  Shop Cover
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <footer className="h-14 border-t border-white/5 flex items-center px-8 bg-[#0e0e0e]">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#3de1fc] shadow-[0_0_8px_rgba(61,225,252,0.6)]"></div>
          <span className="text-[10px] uppercase tracking-widest text-[#d0c5af] font-medium">
            Cloud sync active: All assets updated
          </span>
        </div>
        <div className="ml-auto">
          <span className="text-[10px] uppercase tracking-widest text-[#d0c5af]/40">
            Version 2.4.0
          </span>
        </div>
      </footer>
    </div>
  );

  const renderPrivacy = () => (
    <div className="px-6 md:px-12 py-8 md:py-10 space-y-8 md:space-y-12 max-w-5xl mx-auto w-full">
      <div className="space-y-2">
        <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] text-[#f2ca50]/60">
          Credentials
        </span>
        <h3 className="text-2xl md:text-4xl font-extrabold text-[#e5e2e1] font-['Manrope']">
          Privacy & Security
        </h3>
      </div>

      <div className="grid grid-cols-1 gap-6 md:gap-8">
        <div className="bg-[#1c1b1b] p-6 md:p-8 rounded-2xl border border-white/5 space-y-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-4 flex-1">
              <div className="p-3 bg-[#2a2a2a] rounded-xl text-[#f2ca50] shrink-0">
                <span className="material-symbols-outlined">storefront</span>
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="text-base md:text-lg font-bold text-[#e5e2e1] truncate">
                  Shop Status
                </h4>
                <p className="text-xs md:text-sm text-[#d0c5af]/60 line-clamp-2">
                  Control whether your barbershop is publicly visible.
                </p>
              </div>
            </div>

            {shopStatus && (
              <div
                className={`w-fit px-4 py-1.5 rounded-full text-[10px] md:text-xs font-bold ${
                  shopStatus === "ACTIVO"
                    ? "bg-green-500/10 text-green-400"
                    : "bg-gray-500/10 text-gray-400"
                }`}
              >
                {shopStatus}
              </div>
            )}
          </div>

          {statusSuccess && (
            <div className="text-green-400 text-xs md:text-sm">
              Status updated successfully
            </div>
          )}

          {statusError && (
            <div className="text-red-400 text-xs md:text-sm">{statusError}</div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-4 border-t border-white/5 gap-4">
            <div className="min-w-0">
              <p className="text-sm font-bold text-[#e5e2e1]">
                {shopStatus === "ACTIVO" ? "Active" : "Inactive"}
              </p>
              <p className="text-[10px] md:text-xs text-[#d0c5af]/60 truncate">
                {shopStatus === "ACTIVO"
                  ? "Your shop is visible and accepting bookings"
                  : "Your shop is hidden from clients"}
              </p>
            </div>

            <div className="shrink-0 flex justify-end">
              <ToggleSwitch
                checked={shopStatus === "ACTIVO"}
                disabled={statusLoading}
                onChange={(value) => {
                  const newStatus = value ? "ACTIVO" : "INACTIVO";

                  if (newStatus === "INACTIVO") {
                    const confirmAction = confirm(
                      "Are you sure you want to deactivate your shop?",
                    );
                    if (!confirmAction) return;
                  }

                  handleShopStatusChange(newStatus);
                }}
              />
            </div>
          </div>
        </div>

        <div className="bg-[#1c1b1b] p-6 md:p-8 rounded-2xl border border-white/5 space-y-8 shadow-xl">
          {pwSuccess && (
            <div className="bg-green-500/10 border border-green-500/20 text-green-400 px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">
                check_circle
              </span>
              Password updated successfully
            </div>
          )}
          {pwError && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">error</span>
              {pwError}
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="p-3 bg-[#2a2a2a] rounded-xl text-[#f2ca50] w-fit">
              <span className="material-symbols-outlined">key</span>
            </div>
            <div>
              <h4 className="text-base md:text-lg font-bold text-[#e5e2e1]">
                Update Password
              </h4>
              <p className="text-xs md:text-sm text-[#d0c5af]/60">
                Ensure your account is using a long, random password to stay
                secure.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#d0c5af] ml-1">
                Current Password
              </label>
              <div className="relative">
                <input
                  className="w-full bg-[#2a2a2a] border-none rounded-2xl py-4 px-6 text-[#e5e2e1] focus:ring-2 focus:ring-[#f2ca50]/20 transition-all placeholder:text-white/10 outline-none"
                  placeholder="••••••••••••"
                  type={showPw.current ? "text" : "password"}
                  value={pwForm.currentPassword}
                  onChange={(e) =>
                    setPwForm((prev) => ({
                      ...prev,
                      currentPassword: e.target.value,
                    }))
                  }
                />
                <span
                  onClick={() =>
                    setShowPw((prev) => ({ ...prev, current: !prev.current }))
                  }
                  className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-[#d0c5af]/40 cursor-pointer hover:text-[#d0c5af]"
                >
                  {showPw.current ? "visibility_off" : "visibility"}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#d0c5af] ml-1">
                  New Password
                </label>
                <div className="relative">
                  <input
                    className="w-full bg-[#2a2a2a] border-none rounded-2xl py-4 px-6 text-[#e5e2e1] focus:ring-2 focus:ring-[#f2ca50]/20 transition-all outline-none"
                    type={showPw.new ? "text" : "password"}
                    value={pwForm.newPassword}
                    onChange={(e) =>
                      setPwForm((prev) => ({
                        ...prev,
                        newPassword: e.target.value,
                      }))
                    }
                  />
                  <span
                    onClick={() =>
                      setShowPw((prev) => ({ ...prev, new: !prev.new }))
                    }
                    className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-[#d0c5af]/40 cursor-pointer hover:text-[#d0c5af]"
                  >
                    {showPw.new ? "visibility_off" : "visibility"}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#d0c5af] ml-1">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    className="w-full bg-[#2a2a2a] border-none rounded-2xl py-4 px-6 text-[#e5e2e1] focus:ring-2 focus:ring-[#f2ca50]/20 transition-all outline-none"
                    type={showPw.confirm ? "text" : "password"}
                    value={pwForm.confirmNewPassword}
                    onChange={(e) =>
                      setPwForm((prev) => ({
                        ...prev,
                        confirmNewPassword: e.target.value,
                      }))
                    }
                  />
                  <span
                    onClick={() =>
                      setShowPw((prev) => ({ ...prev, confirm: !prev.confirm }))
                    }
                    className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-[#d0c5af]/40 cursor-pointer hover:text-[#d0c5af]"
                  >
                    {showPw.confirm ? "visibility_off" : "visibility"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-center sm:justify-end">
            <button
              onClick={handlePasswordUpdate}
              disabled={pwLoading}
              className="w-full sm:w-auto bg-[#f2ca50] text-[#3c2f00] px-8 py-4 rounded-full font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-[#f2ca50]/10 disabled:opacity-50 disabled:pointer-events-none"
            >
              {pwLoading ? (
                <>
                  <span className="material-symbols-outlined text-sm animate-spin">
                    progress_activity
                  </span>
                  Updating...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-sm">
                    verified_user
                  </span>
                  Update Password
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="relative h-40 w-full rounded-3xl overflow-hidden flex items-center px-10 group bg-[#1c1b1b] border border-white/5">
        <div className="absolute inset-0 bg-gradient-to-r from-[#1c1b1b] to-transparent z-10"></div>
        <div className="relative z-20 flex flex-col">
          <span className="text-[#f2ca50] font-black text-5xl opacity-10">
            EST. 2026
          </span>
          <p className="text-[#d0c5af] text-[10px] uppercase tracking-[0.5em] font-medium">
            Secured by Midnight Guard
          </p>
        </div>
      </div>
    </div>
  );

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={onClose}
      />

      <div className="relative w-full max-w-6xl h-[90vh] max-h-[900px] bg-[#131313] rounded-3xl shadow-2xl flex overflow-hidden border border-white/10 animate-in fade-in zoom-in-95 duration-300">
        {renderSidebar()}

        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <main className="flex-1 flex flex-col bg-[#131313] overflow-y-auto relative pt-20 md:pt-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden absolute top-8 left-8 z-30 bg-[#1c1b1b] p-2 rounded-full"
          >
            <span className="material-symbols-outlined text-[#f2ca50]">
              menu
            </span>
          </button>

          <button
            onClick={onClose}
            className="absolute top-8 right-8 z-30 w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-[#d0c5af] hover:text-[#e5e2e1] hover:bg-white/10 transition-all"
          >
            <span className="material-symbols-outlined">close</span>
          </button>

          {activeSection === "shop" && renderShopInfo()}
          {activeSection === "gallery" && renderGallery()}
          {activeSection === "privacy" && renderPrivacy()}
        </main>
      </div>
    </div>,
    document.body,
  );
};

export default SettingsModal;
