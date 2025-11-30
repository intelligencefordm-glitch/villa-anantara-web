import "./globals.css";
import Header from "@/components/Header";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";

export const metadata = {
  title: "Villa Anantara",
  description: "Luxury farmhouse stay near Raipur",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-900">
        {/* Navbar */}
        <Header />

        {/* Page content */}
        {children}

        {/* Floating WhatsApp Button */}
        <FloatingWhatsApp />
      </body>
    </html>
  );
}
