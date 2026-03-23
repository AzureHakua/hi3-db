import { Html } from "@elysiajs/html"
import { Layout } from "../layout"
import { SearchBar } from "../components/SearchBar"
import { Stigma, StigmataList } from "../components"
import { getStigmata } from "../backend/modules"

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

export const stigmataDetailPage = async ({ params }: { params: { id: number } }) => {
  const result = await getStigmata({ query: { id: params.id } })
  if (!result.data[0])
    return (
      <Layout>
        <p class="text-center">Not found</p>
      </Layout>
    )
  return (
    <Layout>
      <div class="3xl:max-w-screen-xl mx-auto my-4 grid w-full max-w-5xl grid-cols-1 gap-4">
        <Stigma {...result.data[0]} linkable={false} />
      </div>
    </Layout>
  )
}
