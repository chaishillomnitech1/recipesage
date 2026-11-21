// ScrollVerse asset footer — every app links back to Chais Hill's assets.
// Links only; no app logic, payments, or auth touched.

const ASSET_LINKS = [
  { label: "Vault", href: "https://chaishillomnitech1.github.io/the-gods-vault/" },
  { label: "Shop", href: "https://juv8tg-1n.myshopify.com" },
  { label: "Music", href: "https://vyd.co/ChaisTheGreatVictory" },
  { label: "Spotify", href: "https://open.spotify.com/artist/3P0GWluMPNZ2xSCVffVGAr" },
  { label: "Atlas", href: "https://muse.ai/s/super-scrollverse-bxy6xtuxz8xm5xvn/Tm8xFKLXO7E7C83iUb9IYReHT3QuXoi714p1sJx8eWU" },
  { label: "SovereignHub", href: "https://muse.ai/s/sovereignhub-xzi6xve4xmxbewn/ejSnZZ4BXy-7F1E6qXfdDF1M_acGNV_VoiShXjEgmxc" },
];

export default function ScrollVerseFooter({ className = "" }: { className?: string }) {
  return (
    <footer className={`border-t border-border bg-background py-8 ${className}`}>
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-3 px-4 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-foreground">
          ScrollVerse
        </p>
        <nav
          className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2"
          aria-label="ScrollVerse assets"
        >
          {ASSET_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noreferrer noopener"
              className="text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <p className="text-xs text-muted-foreground">Chais Hill — ScrollVerse LLC</p>
      </div>
    </footer>
  );
}
