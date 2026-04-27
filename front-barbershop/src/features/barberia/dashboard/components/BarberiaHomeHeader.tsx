import { useAuthStore } from "../../../auth/authStore";

export default function BarberiaHomeHeader() {
  const { user } = useAuthStore();
  
  return (
    <div className="flex flex-col gap-1 mb-8">
      <span className="text-[10px] uppercase tracking-[0.2em] text-primary font-bold">
        Executive Overview
      </span>
      <h1 className="text-4xl font-extrabold text-on-surface font-headline tracking-tighter">
        {user?.barberShopName || "The Shop"}
      </h1>
    </div>
  );
}
