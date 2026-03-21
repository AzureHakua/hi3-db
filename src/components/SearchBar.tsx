import { Html } from "@elysiajs/html"

export const SearchBar = ({
  placeholder,
  target,
  endpoint,
}: {
  placeholder: string
  target: string
  endpoint: string
}) => (
  <div class="m-4 flex justify-center">
    <div class="3xl:max-w-screen-xl relative w-full max-w-4xl">
      <input
        type="text"
        id="search-input"
        name="search"
        placeholder={placeholder}
        class="my-2 w-full rounded-md bg-slate-800 p-2 text-white"
        hx-trigger="keyup changed delay:500ms"
        hx-get={endpoint}
        hx-target={`#${target}`}
        hx-swap="innerHTML transition:true"
        hx-indicator="#search-indicator"
        hx-on--before-request={`document.getElementById('${target}').innerHTML=''`}
      />
      <span
        id="search-indicator"
        class="htmx-indicator searching-pulse absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400"
      >
        Searching...
      </span>
    </div>
  </div>
)
