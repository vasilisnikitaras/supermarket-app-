import "./globals.css"; // Εδώ καλούμε το αρχείο css που έφτιαξες παραπάνω
import DashboardLayout from "../components/DashboardLayout";

export const metadata = {
  title: "Supermarket App",
  description: "Dashboard",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="el">
      <body className="bg-white text-black">
        <DashboardLayout>{children}</DashboardLayout>
      </body>
    </html>
  );
}
