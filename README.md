# 🎬 Movie Finder

Aplicación web para descubrir y explorar películas usando la API de TMDB. Construida con Next.js 15 y desplegada en Vercel.

🔗 **Demo en vivo:** [movie-finder-farra.vercel.app](https://movie-finder-farra.vercel.app)

---

## Capturas de pantalla

<!-- Añade aquí capturas de pantalla de la app -->

---

## Tecnologías

- [Next.js 15](https://nextjs.org/) — framework fullstack con App Router
- [React 19](https://react.dev/) — librería de interfaces de usuario
- [TMDB API](https://www.themoviedb.org/) — datos de películas
- CSS Modules — estilos con alcance local
- [Vercel](https://vercel.com/) — deploy y hosting

---

## Funcionalidades

- Listado de películas populares
- Buscador por título
- Filtrado por género
- Ordenación por popularidad, puntuación o año
- Paginación con "Ver más"
- Página de detalle con sinopsis, duración y géneros
- Enlace al trailer en YouTube
- Películas similares en la página de detalle
- Navbar y footer en todas las páginas

---

## Ejecutar en local

### Requisitos

- Node.js 18 o superior
- Cuenta en [TMDB](https://www.themoviedb.org/) para obtener una API key gratuita

### Pasos

1. Clona el repositorio:

\```bash
git clone https://github.com/tu-usuario/movie-finder.git
cd movie-finder
\```

2. Instala las dependencias:

\```bash
npm install
\```

3. Crea el archivo `.env.local` en la raíz del proyecto:

\```
NEXT_PUBLIC_TMDB_API_KEY=tu_api_key
\```

4. Arranca el servidor de desarrollo:

\```bash
npm run dev
\```

5. Abre [http://localhost:3000](http://localhost:3000) en el navegador.

---

## Estructura del proyecto

\```
app/
├── components/
│   ├── Navbar.js
│   ├── Navbar.module.css
│   ├── MovieList.js
│   ├── MovieList.module.css
│   ├── Footer.js
│   └── Footer.module.css
├── pelicula/
│   └── [id]/
│       ├── page.js
│       └── page.module.css
├── page.js
├── layout.js
└── globals.css
\```

---

## Autor

Pau — [GitHub](https://github.com/tu-usuario) · [LinkedIn](https://linkedin.com/in/tu-usuario)

---

*Datos proporcionados por [TMDB](https://www.themoviedb.org/). Iconos por varios autores vía [icon-icons.com](https://icon-icons.com) — [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)*