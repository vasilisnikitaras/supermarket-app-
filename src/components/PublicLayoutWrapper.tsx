"use client";
import { usePathname } from "next/navigation";

export default function PublicLayoutWrapper({ children, DashboardLayout }: { children: React.ReactNode; DashboardLayout: any }) {
  const pathname = usePathname();

  // 👑 Αν το URL περιέχει τη λέξη public-offers, εμφανίζουμε σκέτο το φυλλάδιο χωρίς Login και χωρίς Sidebars!
  if (pathname?.includes("/public-offers")) {
    return <>{children}</>;
  }

  // Για όλες τις άλλες σελίδες, φορτώνει κανονικά η προστασία του Admin Panel
  return <DashboardLayout>{children}</DashboardLayout>;
}
