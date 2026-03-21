import { Html } from "@elysiajs/html"
import { Layout } from "../layout"
import { SearchBar } from "../components/SearchBar"
import { StigmataList } from "../components"
import { getStigmata } from "../backend/routes"
import { stigmataPositions, stigmataImages } from "../backend/db/schema"

export const stigmataPage = () => (
  <Layout>
    <>
      <h1 class="mb-2 text-center text-3xl font-bold">Stigmata</h1>
      <SearchBar placeholder="Search stigmata..." target="stigmata-list" endpoint="/stigmata-list" />
      <div
        id="stigmata-list"
        hx-get="/stigmata-list"
        hx-trigger="load"
        hx-target="#stigmata-list"
        hx-swap="innerHTML transition:true"
      ></div>
    </>
  </Layout>
)

export const stigmataListPage = async ({ query }: { query: { search?: string; offset?: string } }) => {
  try {
    const searchTerm = query.search ?? ""
    const offset = query.offset ? Number(query.offset) : 0
    const result = await getStigmata({
      query: {
        name: searchTerm ? { $like: `%${searchTerm}%` } : undefined,
        offset,
      },
    })
    return (
      <StigmataList
        stigmata={result.data}
        hasMore={result.hasMore}
        hasFlags={result.hasFlags}
        offset={offset}
        search={searchTerm}
      />
    )
  } catch (error) {
    console.error("Error fetching stigmata:", error)
    return <div class="text-slate-200">Error fetching stigmata data</div>
  }
}

export const stigmataPositionPage = async ({ params }: { params: { id: number; index: number } }) => {
  const result = await getStigmata({ query: { id: params.id } })
  if (result.data.length === 0) return "Stigmata not found"

  const stigma = result.data[0]
  const pos = stigma.positions[params.index]

  return (
    <>
      {stigma.positions.map((_: typeof stigmataPositions.$inferSelect, i: number) => (
        <div id={`icon-${stigma.id}-${i}`} hx-swap-oob="outerHTML">
          <div
            data-key={i}
            class={`relative aspect-[3/1] cursor-pointer rounded-full border-2 transition-all duration-200 ${
              stigma.positions.length === 1 ? "col-start-2" : ""
            } ${
              i === params.index
                ? "border-violet-400 bg-violet-400/30"
                : "border-slate-400 bg-slate-600 hover:scale-105 hover:border-slate-100"
            }`}
            id={`icon-${stigma.id}-${i}`}
            hx-get={`/stigmata/${stigma.id}/position/${i}`}
            hx-target={`#content-container-${stigma.id}`}
            hx-swap="innerHTML transition:true"
          >
            <div
              class={`absolute flex h-full w-full items-center justify-center rounded-full text-lg font-bold ${
                i === params.index ? "text-violet-300" : "text-slate-300"
              }`}
            >
              {stigma.positions[i].position}
            </div>
          </div>
        </div>
      ))}
      {stigma.images && stigma.images.length > 0 && (
        <div class="mx-4 flex aspect-square overflow-hidden rounded-none border-2 border-slate-400 md:mx-10">
          <img
            src={
              stigma.images.find((img: typeof stigmataImages.$inferSelect) => img.position === pos.position)?.imgUrl ??
              ""
            }
            alt={`${stigma.name} ${pos.position}`}
            class="h-full w-full rounded object-cover"
            loading="lazy"
          />
        </div>
      )}
    </>
  )
}
