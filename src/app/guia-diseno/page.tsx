export const metadata = {
  title: "Guía de diseño — Octógonos",
  robots: "noindex, nofollow",
};

function Zone({
  title,
  size,
  children,
}: {
  title: string;
  size: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl bg-voraz-white p-5 shadow-[var(--shadow-card)] sm:p-6">
      <div className="mb-3 flex flex-wrap items-baseline gap-2">
        <h3 className="font-display text-sm font-bold uppercase tracking-wide text-voraz-black">
          {title}
        </h3>
        <span className="rounded-full bg-voraz-gray-100 px-2.5 py-0.5 font-mono text-[11px] text-voraz-gray-500">
          {size}
        </span>
      </div>
      <div className="text-sm leading-relaxed text-voraz-gray-600">
        {children}
      </div>
    </div>
  );
}

export default function GuiaDiseno() {
  return (
    <div className="mx-auto max-w-3xl px-6 pb-16 pt-10">
      {/* Header */}
      <div className="mb-10">
        <span className="font-display text-xs font-bold uppercase tracking-[0.2em] text-voraz-red">
          Documento interno
        </span>
        <h1 className="mt-2 font-display text-3xl font-black uppercase leading-tight text-voraz-black sm:text-4xl">
          Guía de diseño
        </h1>
        <p className="mt-3 max-w-lg text-base leading-relaxed text-voraz-gray-600">
          Medidas y estructura del sitio Octógonos para crear assets
          visuales. Trabajar en <strong>Figma</strong> y exportar en PNG/SVG.
        </p>
      </div>

      {/* Zonas */}
      <section className="mb-10">
        <h2 className="mb-4 font-display text-lg font-bold uppercase tracking-wide text-voraz-black">
          Zonas del sitio
        </h2>
        <div className="grid gap-4">
          <Zone title="Contenedor general" size="1152px desktop / 100% mobile">
            <p>
              Todo el contenido vive dentro de un contenedor centrado.
              En desktop tiene un ancho máximo de <strong>1152px</strong>.
              En mobile ocupa el 100% con <strong>24px de padding</strong> a cada lado.
            </p>
          </Zone>

          <Zone title="Header (barra superior)" size="44px de alto · ancho completo">
            <p>
              Barra fija en la parte superior. Contiene el logo &quot;OCTÓGONOS&quot;
              en texto + &quot;por VORAZ&quot; + un punto rojo. Fondo crema semitransparente
              con efecto blur. A la derecha: links de navegación.
            </p>
          </Zone>

          <Zone title="Hero (sección principal)" size="Texto max 512px">
            <p>
              Título grande &quot;OCTÓGONOS DE CANDIDATOS + IA&quot; en Barlow Condensed black.
              Debajo: línea roja de 64px, subtítulo descriptivo y badge con punto rojo animado.
            </p>
            <p className="mt-2 rounded-lg bg-voraz-cream p-3 text-xs text-voraz-gray-500">
              <strong>Oportunidad:</strong> Se puede agregar una ilustración o gráfico
              al lado derecho del título en desktop. Espacio disponible: ~500px de ancho.
            </p>
          </Zone>

          <Zone title="Tarjetas de candidato" size="~357×123px desktop · 1-3 columnas">
            <p>
              Grid responsivo: <strong>1 columna</strong> en mobile,{" "}
              <strong>2 columnas</strong> en tablet, <strong>3 columnas</strong> en
              desktop. Cada tarjeta es blanca con sombra suave y bordes redondeados (12px).
              Contiene foto circular (48px), nombre, partido, % de encuesta y 3 badges de octógono.
            </p>
          </Zone>

          <Zone title="Página de candidato" size="Max 896px centrado">
            <p>
              Página de detalle con 3 secciones: Educación, Legal y Plan de gobierno.
              Cada sección muestra un octógono (sello) con colores semáforo (verde/ámbar/rojo),
              explicación, fuentes y contexto de IA si existe.
            </p>
          </Zone>

          <Zone title="Footer" size="Ancho completo · fondo #1A1A1A">
            <p>
              Transición gradiente desde crema (#F5F0E8) a oscuro (#1A1A1A).
              Logo en blanco, links de navegación en gris claro, disclaimer legal.
            </p>
          </Zone>
        </div>
      </section>

      {/* Assets prioritarios */}
      <section className="mb-10">
        <h2 className="mb-4 font-display text-lg font-bold uppercase tracking-wide text-voraz-black">
          Assets a diseñar (prioridad)
        </h2>
        <div className="grid gap-3">
          {[
            {
              priority: "1",
              title: "OG Image (imagen para redes)",
              size: "1200 × 630px",
              desc: "Lo que la gente ve cuando comparten el link en WhatsApp, Twitter, Facebook. Debe incluir el logo, un headline atractivo y los colores de marca. Formato: PNG.",
              color: "bg-voraz-red",
            },
            {
              priority: "2",
              title: "Ilustración para Hero",
              size: "~500 × 400px",
              desc: "Gráfico o ilustración para acompañar el título principal en desktop. Puede ser una representación visual de los octógonos o del concepto de transparencia electoral. Formato: SVG o PNG con fondo transparente.",
              color: "bg-voraz-red",
            },
            {
              priority: "3",
              title: "Favicon / App Icon",
              size: "512 × 512px",
              desc: "Ícono de la app para el browser tab y cuando se guarda en el celular. Debe funcionar a tamaños muy pequeños (16×16). Formato: PNG y SVG.",
              color: "bg-score-neutro",
            },
            {
              priority: "4",
              title: "Íconos de pilares (opcional)",
              size: "64 × 64px c/u",
              desc: "3 íconos: Educación (birrete/libro), Legal (balanza/martillo), Plan (documento/check). Para usar dentro de los octógonos. Formato: SVG.",
              color: "bg-voraz-gray-400",
            },
          ].map((item) => (
            <div
              key={item.priority}
              className="flex gap-4 rounded-xl bg-voraz-white p-5 shadow-[var(--shadow-card)]"
            >
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${item.color} font-display text-sm font-black text-white`}
              >
                {item.priority}
              </div>
              <div>
                <div className="flex flex-wrap items-baseline gap-2">
                  <h3 className="text-sm font-bold text-voraz-black">
                    {item.title}
                  </h3>
                  <span className="rounded-full bg-voraz-gray-100 px-2 py-0.5 font-mono text-[10px] text-voraz-gray-500">
                    {item.size}
                  </span>
                </div>
                <p className="mt-1 text-xs leading-relaxed text-voraz-gray-500">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Formato de entrega */}
      <section className="mb-10">
        <h2 className="mb-4 font-display text-lg font-bold uppercase tracking-wide text-voraz-black">
          Formato de entrega
        </h2>
        <div className="rounded-xl bg-voraz-white p-5 shadow-[var(--shadow-card)] sm:p-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-score-bajo/10 text-xs font-bold text-score-bajo">
                  ✓
                </span>
                <span className="text-sm font-bold text-voraz-black">
                  Figma
                </span>
              </div>
              <p className="text-xs text-voraz-gray-500">
                Preferido. Compartir link del archivo con permisos de vista.
                El equipo tech inspecciona y exporta directo.
              </p>
            </div>
            <div>
              <div className="mb-2 flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-score-neutro/10 text-xs font-bold text-score-neutro">
                  ~
                </span>
                <span className="text-sm font-bold text-voraz-black">
                  Illustrator
                </span>
              </div>
              <p className="text-xs text-voraz-gray-500">
                Aceptable. Exportar como SVG o PNG@2x. Incluir archivo
                .ai editable.
              </p>
            </div>
            <div>
              <div className="mb-2 flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-voraz-red/10 text-xs font-bold text-voraz-red">
                  ✗
                </span>
                <span className="text-sm font-bold text-voraz-black">
                  PDF / JPG
                </span>
              </div>
              <p className="text-xs text-voraz-gray-500">
                No sirve para web. No se pueden extraer elementos
                individuales ni escalar sin perder calidad.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Qué pueden personalizar */}
      <section className="mb-10">
        <h2 className="mb-4 font-display text-lg font-bold uppercase tracking-wide text-voraz-black">
          Qué pueden personalizar
        </h2>
        <div className="rounded-xl bg-voraz-white p-5 shadow-[var(--shadow-card)] sm:p-6">
          <p className="mb-4 text-sm leading-relaxed text-voraz-gray-600">
            El equipo de marketing/diseño puede proponer cambios en estos elementos.
            La estructura del sitio no cambia — solo la <strong>&quot;piel&quot;</strong> visual.
          </p>
          <div className="grid gap-3">
            {[
              {
                element: "Tipografías",
                what: "Reemplazar Barlow Condensed e Inter por las tipografías de la marca",
                format: "Nombre exacto de Google Fonts, o archivos .woff2 si son custom",
              },
              {
                element: "Paleta de colores",
                what: "Cambiar los colores principales (rojo, crema, dorado, etc.) por los de la marca",
                format: "Códigos HEX de cada color (#RRGGBB)",
              },
              {
                element: "Logo",
                what: "Reemplazar el texto 'OCTÓGONOS por VORAZ' por un logo gráfico",
                format: "SVG (preferido) o PNG con fondo transparente. Alto máximo: 32px",
              },
              {
                element: "Ilustraciones",
                what: "Agregar gráficos en el hero, tarjetas o secciones del sitio",
                format: "SVG o PNG@2x con fondo transparente",
              },
              {
                element: "OG Image",
                what: "Rediseñar la imagen que aparece al compartir el link en redes",
                format: "PNG de 1200×630px, máximo 200KB",
              },
              {
                element: "Favicon",
                what: "Ícono del sitio para el tab del navegador y acceso directo en celular",
                format: "PNG de 512×512px y versión de 32×32px",
              },
            ].map((item) => (
              <div
                key={item.element}
                className="rounded-lg bg-voraz-cream/60 p-4"
              >
                <div className="flex flex-wrap items-baseline gap-2">
                  <span className="text-sm font-bold text-voraz-black">
                    {item.element}
                  </span>
                </div>
                <p className="mt-1 text-xs text-voraz-gray-600">
                  {item.what}
                </p>
                <p className="mt-1 text-[11px] text-voraz-gray-400">
                  <strong>Entregar:</strong> {item.format}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-4 rounded-lg bg-voraz-red/5 p-3 text-xs leading-relaxed text-voraz-gray-600">
            <strong className="text-voraz-red">Importante:</strong> Al entregar assets en Figma,
            el equipo tech puede aplicar todos los cambios visuales en menos de una hora.
            No es necesario saber código — solo diseñar y compartir el link del archivo Figma.
          </p>
        </div>
      </section>

      {/* Frames Figma */}
      <section>
        <h2 className="mb-4 font-display text-lg font-bold uppercase tracking-wide text-voraz-black">
          Frames sugeridos en Figma
        </h2>
        <div className="rounded-xl bg-voraz-white p-5 shadow-[var(--shadow-card)] sm:p-6">
          <div className="space-y-3">
            {[
              { name: "Desktop", size: "1280 × 900", note: "Vista principal" },
              {
                name: "Mobile",
                size: "375 × 812",
                note: "iPhone SE / estándar",
              },
              {
                name: "OG Image",
                size: "1200 × 630",
                note: "Para redes sociales",
              },
              { name: "Favicon", size: "512 × 512", note: "Ícono de app" },
            ].map((frame) => (
              <div
                key={frame.name}
                className="flex items-center justify-between rounded-lg bg-voraz-cream/60 px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-voraz-black">
                    {frame.name}
                  </span>
                  <span className="text-xs text-voraz-gray-400">
                    {frame.note}
                  </span>
                </div>
                <span className="font-mono text-xs font-semibold text-voraz-gray-500">
                  {frame.size}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Alcance y límites */}
      <section className="mb-10">
        <h2 className="mb-4 font-display text-lg font-bold uppercase tracking-wide text-voraz-black">
          Alcance y límites (para avanzar rápido)
        </h2>
        <div className="rounded-xl bg-voraz-white p-5 shadow-[var(--shadow-card)] sm:p-6">
          <p className="mb-4 text-sm leading-relaxed text-voraz-gray-600">
            Este documento es para crear assets visuales (logo, OG, íconos, ilustración)
            y vestir la web <strong>sin cambiar estructura</strong>.
          </p>

          <div className="mb-4 rounded-lg bg-score-bajo/5 p-4">
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-score-bajo">
              Cambios incluidos (dentro del cupo)
            </p>
            <ul className="space-y-1 text-sm text-voraz-gray-600">
              <li>Ajustes de copy (textos, títulos, descripciones)</li>
              <li>Orden de bloques y links</li>
              <li>Assets: logo, ilustraciones, íconos</li>
              <li>Colores y tipografías</li>
              <li>OG Image y favicon</li>
            </ul>
          </div>

          <div className="mb-4 rounded-lg bg-voraz-red/5 p-4">
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-voraz-red">
              No incluido (V2)
            </p>
            <ul className="space-y-1 text-sm text-voraz-gray-600">
              <li>Rediseño completo del sitio</li>
              <li>Cambios de estructura o layout</li>
              <li>Nuevas secciones grandes o nueva arquitectura</li>
              <li>Esto se ve como V2 y requiere acuerdo adicional</li>
            </ul>
          </div>

          <div className="rounded-lg bg-voraz-gold/10 p-4">
            <p className="mb-1 text-xs font-bold uppercase tracking-wide text-voraz-gold">
              Cupo máximo
            </p>
            <p className="text-sm text-voraz-gray-600">
              Hasta <strong>10 solicitudes de cambio</strong> en total durante la campaña.
              Priorizar y agrupar.
            </p>
          </div>

          <div className="mt-5 rounded-lg border border-voraz-gray-200 p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-voraz-black">
              Cómo trabajamos
            </p>
            <p className="mt-1 text-sm text-voraz-gray-600">
              Mandar cambios agrupados en <strong>una sola lista</strong> (1–10),
              no por mensajes sueltos. Así avanzamos más rápido y no se pierde nada.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
