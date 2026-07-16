import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { AuthProvider } from "@/hooks/use-auth";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-4 p-4 bg-destructive/10 text-destructive rounded-md text-xs font-mono text-left overflow-auto max-h-32">
          {error.message || "Unknown error"}
        </div>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "FatureAqui — Software de Faturação Moçambique | Emitir Faturas Online" },
      {
        name: "description",
        content: "O melhor software de faturação online em Moçambique, certificado pela AT. Emita faturas em segundos, com plano grátis e pagamentos M-Pesa integrados.",
      },
      { name: "keywords", content: "Software de faturação Moçambique, Emitir faturas online, Sistema de faturação M-Pesa, Faturas grátis Moçambique, Software certificado AT Moçambique, Gestão de negócios Moçambique" },
      { name: "robots", content: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" },
      { property: "og:title", content: "FatureAqui — Software de Faturação Moçambique" },
      {
        property: "og:description",
        content: "Emita faturas em segundos com o sistema mais fácil de Moçambique. Certificado pela AT, integração M-Pesa e plano gratuito disponível.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://fatureaqui.com" },
      { property: "og:site_name", content: "FatureAqui" },
      { property: "og:locale", content: "pt_MZ" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "FatureAqui — Software de Faturação Moçambique" },
      { name: "twitter:description", content: "Emita faturas em segundos com o sistema mais fácil de Moçambique. Certificado pela AT." },
      { name: "google-site-verification", content: "Q-lHKEc1oD3LJQ_cCGI-IYm_qhf7Gz35qIsQlCVdDdA" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.png", type: "image/png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "FatureAqui",
          "operatingSystem": "WebBrowser",
          "applicationCategory": "BusinessApplication",
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.9",
            "ratingCount": "128"
          },
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "MZN",
            "description": "Plano gratuito até 300 documentos por mês"
          },
          "description": "Software de faturação online em Moçambique, certificado pela Autoridade Tributária (AT). Permite a gestão de negócios, emissão de faturas e recibos em segundos, e inclui integração nativa com pagamentos M-Pesa.",
          "url": "https://fatureaqui.com",
          "publisher": {
            "@type": "Organization",
            "name": "FatureAqui Moçambique"
          }
        })
      }
    ]
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="pt">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

import { Toaster } from "sonner";

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
        <Outlet />
        <Toaster position="top-right" richColors />
      </AuthProvider>
    </QueryClientProvider>
  );
}
