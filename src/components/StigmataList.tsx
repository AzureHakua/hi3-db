import { html, Html } from "@elysiajs/html"
import { SelectStigmata } from "../backend/db/schema"
import { Stigma } from "./Stigma"

export function StigmataList({
  stigmata,
  hasMore,
  hasFlags,
  offset,
  search,
}: {
  stigmata: SelectStigmata[]
  hasMore: boolean
  hasFlags: boolean
  offset: number
  search: string
}) {
  const newOffset = offset + stigmata.length

  const loadMoreBtn = hasMore ? (
    <div id="load-more-btn" class="my-4 flex items-center justify-center gap-4">
      <span class="text-sm text-slate-400">Showing first {newOffset} results</span>
      <button
        class="rounded-lg border border-slate-600 bg-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition-all duration-200 hover:border-violet-400 hover:bg-violet-400/60 hover:text-white"
        hx-get="/stigmata-list"
        hx-target="#stigmata-grid"
        hx-swap="beforeend"
        hx-include="#search-input"
        hx-vals={`{"offset": "${newOffset}"}`}
        hx-on--after-swap="htmx.process(document.getElementById('stigmata-items'))"
      >
        Load More
      </button>
    </div>
  ) : (
    <div id="load-more-btn" class="my-4 flex items-center justify-center gap-4">
      <span class="text-sm text-slate-400">Showing all {newOffset} results</span>
    </div>
  )

  if (offset > 0) {
    // Load more — return raw items only, no wrapper
    // Button updates itself via oob
    return (
      <>
        {stigmata.map((stigma) => (
          <Stigma {...stigma} />
        ))}
        <div id="load-more-btn" hx-swap-oob="outerHTML">
          {loadMoreBtn}
        </div>
      </>
    )
  }

  // Initial load — return full wrapper
  return (
    <>
      <div id="stigmata-grid" class="3xl:max-w-screen-xl mx-auto my-4 grid w-full max-w-5xl grid-cols-1 gap-4">
        {stigmata.map((stigma) => (
          <Stigma {...stigma} />
        ))}
      </div>
      {(hasFlags || search) && loadMoreBtn}
    </>
  )
}
