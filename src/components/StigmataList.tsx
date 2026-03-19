import { html, Html } from '@elysiajs/html'
import { SelectStigmata } from '../backend/db/schema'
import { Stigma } from './Stigma'

export function StigmataList({ stigmata, hasMore, hasFlags, offset, search }: { 
  stigmata: SelectStigmata[]
  hasMore: boolean
  hasFlags: boolean
  offset: number
  search: string
}) {
  const newOffset = offset + stigmata.length;

  const loadMoreBtn = hasMore ? (
    <div id="load-more-btn" class="flex items-center justify-center gap-4 my-4">
      <span class="text-slate-400 text-sm">Showing first {newOffset} results</span>
      <button
        class="bg-slate-700 hover:bg-violet-400/60 border border-slate-600 hover:border-violet-400 text-slate-300 hover:text-white text-sm font-medium px-4 py-2 rounded-lg transition-all duration-200"
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
    <div id="load-more-btn" class="flex items-center justify-center gap-4 my-4">
      <span class="text-slate-400 text-sm">Showing all {newOffset} results</span>
    </div>
  );

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
    );
  }

  // Initial load — return full wrapper
  return (
    <>
      <div id="stigmata-grid" class="grid grid-cols-1 max-w-5xl 3xl:max-w-screen-xl w-full gap-4 my-4 mx-auto">
        {stigmata.map((stigma) => (
          <Stigma {...stigma} />
        ))}
      </div>
      {hasFlags && loadMoreBtn}
    </>
  )
}
