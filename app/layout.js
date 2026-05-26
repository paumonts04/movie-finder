import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { GenreProvider } from "./context/GenreContext";

export const metadata = {
  title: "Buscador de Películas",
  description: "App para buscar películas con TMDB",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <GenreProvider>
          <Navbar />
          {children}
          <Footer />
        </GenreProvider>
      </body>
    </html>
  );
}