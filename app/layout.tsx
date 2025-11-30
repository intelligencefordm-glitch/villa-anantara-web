import "./globals.css";
import Header from "../components/Header";
import FloatingInstagram from "../components/FloatingInstagram";
import FloatingWhatsApp from "../components/FloatingWhatsApp";

export const metadata = {
  title: "Villa Anantara",
  description: "Luxury villa stay at Villa Anantara",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-800">
        <Header />

        {children}

        {/* Floating Buttons */}
        <FloatingInstagram />
        <FloatingWhatsApp />
      </body>
    </html>
  );
}
