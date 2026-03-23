import { Html } from "@elysiajs/html"
import { Layout } from "../layout"
import { SearchBar } from "../components/SearchBar"
import { AstralOp, AstralOpList } from "../components"
import { getAstralOp } from "../backend/modules"

export const astralOpsPage = () => (
  <Layout>
    <>
      <h1 class="mb-2 text-center text-3xl font-bold">AstralOps</h1>
      <SearchBar placeholder="Search AstralOps..." target="astralops-list" endpoint="/astralops-list" />
      <div
        id="astralops-list"
        hx-get="/astralops-list"
        hx-trigger="load"
        hx-target="#astralops-list"
        hx-swap="innerHTML transition:true"
      ></div>
    </>
  </Layout>
)

export const astralOpsListPage = async ({ query }: { query: { search?: string } }) => {
  try {
    const searchTerm = query.search ?? ""
    const astralOps = await getAstralOp({
      query: {
        name: searchTerm ? { $like: `%${searchTerm}%` } : undefined,
      },
    })
    return <AstralOpList astralOps={astralOps} />
  } catch (error) {
    console.error("Error fetching astralops:", error)
    return <div class="text-slate-200">Error fetching AstralOps data</div>
  }
}

export const astralOpsDetailPage = async ({ params }: { params: { id: number } }) => {
  const result = await getAstralOp({ query: { id: params.id } })
  if (!result[0])
    return (
      <Layout>
        <p class="text-center">Not found</p>
      </Layout>
    )
  return (
    <Layout>
      <div class="3xl:max-w-screen-xl mx-auto my-4 grid w-full max-w-5xl grid-cols-1 gap-4">
        <AstralOp {...result[0]} linkable={false} />
      </div>
    </Layout>
  )
}
