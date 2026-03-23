import { Html } from "@elysiajs/html"
import { UnderConstruction } from "../layout"

export const valkyriesPage = () => <UnderConstruction page="Valkyries" />

/*
import { Html } from "@elysiajs/html"
import { Layout } from "../layout"
import { SearchBar } from "../components/SearchBar"
import { ValkyriesList } from "../components"
import { getValkyrie } from "../backend/routes"

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
*/
