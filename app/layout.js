import "./globals.css";
import Navbar from "./components/Navbar";
import { GenreProvider } from "./context/GenreContext";
import { Analytics } from '@vercel/analytics/next';

export const metadata = {
  title: "Buscador de Películas",
  description: "App para buscar películas con TMDB",
  icons: {
    icon: '/icons/claqueta.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <GenreProvider>
          <Navbar />
          {children}
          <Analytics />
        </GenreProvider>
      </body>
    </html>
  );
}