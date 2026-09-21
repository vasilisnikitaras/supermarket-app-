import "./globals.css";
import DashboardLayout from "../components/DashboardLayout";
import PublicLayoutWrapper from "../components/PublicLayoutWrapper";

export const metadata = {
  title: "Supermarket App",
  description: "Dashboard",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="el">
      <body className="bg-white text-black">
        {/* 👑 Διαχωρίζουμε live τις σελίδες του Admin από τις δημόσιες σελίδες των πελατών */}
        <PublicLayoutWrapper DashboardLayout={DashboardLayout}>
          {children}
        </PublicLayoutWrapper>
      </body>
    </html>
  );
}
