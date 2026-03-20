import { Html } from "@elysiajs/html"
import { Layout } from "../layout"

export const aboutPage = () => (
  <Layout>
    <>
      <h1 class="mb-2 text-center text-3xl font-bold">About</h1>
      <p class="mb-8 text-center text-lg text-slate-400">Prometheus DB</p>

      <div class="mx-auto max-w-2xl space-y-8">
        <div class="rounded-xl bg-slate-700 p-6">
          <h2 class="mb-3 text-xl font-semibold">What is Prometheus DB?</h2>
          <p class="leading-relaxed text-slate-400">
            Prometheus DB is a fan-made database for Honkai Impact 3rd, providing a searchable reference for weapons,
            stigmata, valkyries, and more. It is a work in progress and new content is added over time.
          </p>
        </div>

        <div class="rounded-xl bg-slate-700 p-6">
          <div class="flex gap-6">
            <div class="flex-1">
              <h2 class="mb-3 text-xl font-semibold">Honkai Impact 3rd</h2>
              <p class="mb-4 leading-relaxed text-slate-400">
                Honkai Impact 3rd is an action RPG developed by HoYoverse. All game data and assets belong to HoYoverse.
              </p>
              <div class="flex flex-wrap gap-3">
                {[
                  {
                    name: "Official Site",
                    url: "https://honkaiimpact3.hoyoverse.com/",
                    icon: "ri-global-line",
                  },
                  {
                    name: "Fandom Wiki",
                    url: "https://honkaiimpact3.fandom.com/",
                    icon: "ri-book-open-line",
                  },
                  {
                    name: "Facebook",
                    url: "https://facebook.com/global.honkaiimpact",
                    icon: "ri-facebook-fill",
                  },
                  {
                    name: "Discord",
                    url: "https://discord.gg/hi3",
                    icon: "ri-discord-fill",
                  },
                  {
                    name: "Twitter",
                    url: "https://twitter.com/HonkaiImpact3rd",
                    icon: "ri-twitter-x-fill",
                  },
                  {
                    name: "Instagram",
                    url: "https://instagram.com/honkaiimpact3rd",
                    icon: "ri-instagram-fill",
                  },
                  {
                    name: "Reddit",
                    url: "https://reddit.com/r/HonkaiImpact3rd",
                    icon: "ri-reddit-fill",
                  },
                ].map((link) => (
                  <a
                    href={link.url}
                    target="_blank"
                    class="flex items-center gap-2 rounded-lg border border-slate-500 bg-slate-600 px-4 py-2 text-sm font-medium text-slate-300 transition-all duration-200 hover:border-violet-400 hover:bg-violet-400/60 hover:text-white"
                  >
                    <i class={link.icon}></i>
                    {link.name}
                  </a>
                ))}
              </div>
            </div>
            <div class="hidden flex-shrink-0 md:block">
              <img src="/img/ui/hi3-cover.png" alt="Honkai Impact 3rd" class="h-full w-32 rounded-lg object-cover" />
            </div>
          </div>
        </div>

        <div class="rounded-xl bg-slate-700 p-6">
          <h2 class="mb-3 text-xl font-semibold">Powered By</h2>
          <div class="grid grid-cols-2 gap-3">
            {[
              {
                name: "Bun",
                url: "https://bun.sh",
                desc: "JavaScript runtime",
                icon: "/img/ui/bun.svg",
              },
              {
                name: "ElysiaJS",
                url: "https://elysiajs.com",
                desc: "Backend framework",
                icon: "/img/ui/elysiajs.svg",
              },
              {
                name: "Turso",
                url: "https://turso.tech",
                desc: "SQLite database",
                icon: "/img/ui/turso.svg",
              },
              {
                name: "HTMX",
                url: "https://htmx.org",
                desc: "Frontend interactivity",
                icon: "/img/ui/htmx.svg",
              },
              {
                name: "Drizzle ORM",
                url: "https://orm.drizzle.team",
                desc: "Database ORM",
                icon: "/img/ui/drizzle-orm.svg",
              },
              {
                name: "Tailwind CSS",
                url: "https://tailwindcss.com",
                desc: "Styling",
                icon: "/img/ui/tailwind-css.svg",
              },
            ].map((tech) => (
              <a
                href={tech.url}
                target="_blank"
                class="flex items-center gap-3 rounded-lg border border-slate-500 bg-slate-600 p-3 transition-all duration-200 hover:border-violet-400 hover:bg-violet-400/60"
              >
                <img src={tech.icon} alt={tech.name} class="h-8 w-8 object-contain" />
                <div>
                  <p class="font-semibold text-slate-200">{tech.name}</p>
                  <p class="text-sm text-slate-400">{tech.desc}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  </Layout>
)
