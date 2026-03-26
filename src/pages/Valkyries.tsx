import { Html } from "@elysiajs/html"
import { Layout } from "../layout"
import { SearchBar } from "../components/SearchBar"
import { Valkyrie, ValkyrieList } from "../components"
import { getValkyrie } from "../backend/modules"

export const valkyriesPage = () => (
  <Layout>
    <>
      <h1 class="mb-2 text-center text-3xl font-bold">Valkyries</h1>
      <SearchBar placeholder="Search Valkyries..." target="valkyries-list" endpoint="/valkyries-list" />
      <div
        id="valkyries-list"
        hx-get="/valkyries-list"
        hx-trigger="load"
        hx-target="#valkyries-list"
        hx-swap="innerHTML transition:true"
      ></div>
    </>
  </Layout>
)

export const valkyriesListPage = async ({ query }: { query: { search?: string } }) => {
  try {
    const searchTerm = query.search ?? ""
    const valkyries = await getValkyrie({
      query: {
        name: searchTerm ? { $like: `%${searchTerm}%` } : undefined,
      },
    })
    return <ValkyrieList valkyries={valkyries} />
  } catch (error) {
    console.error("Error fetching valkyries:", error)
    return <div class="text-slate-200">Error fetching Valkyrie data</div>
  }
}

export const valkyriesDetailPage = async ({ params }: { params: { id: number } }) => {
  const result = await getValkyrie({ query: { id: params.id } })
  if (!result[0])
    return (
      <Layout>
        <p class="text-center">Not found</p>
      </Layout>
    )
  return (
    <Layout>
      <div class="3xl:max-w-screen-xl mx-auto my-4 grid w-full max-w-5xl grid-cols-1 gap-4">
        <Valkyrie {...result[0]} linkable={false} />
      </div>
    </Layout>
  )
}
