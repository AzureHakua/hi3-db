import { Html } from "@elysiajs/html"
import { Layout } from "../layout"
import { WeaponList } from "../components"
import { getWeapon } from "../backend/routes"

export const weaponsPage = () => (
  <Layout>
    <>
      <h1 class="mb-2 text-center text-3xl font-bold">Weapons</h1>
      <div class="m-4 flex justify-center">
        <input
          type="text"
          id="search-input"
          name="search"
          placeholder="Search weapons..."
          class="3xl:max-w-screen-xl my-2 w-full max-w-4xl rounded-md bg-slate-800 p-2 text-white"
          hx-trigger="keyup changed delay:500ms"
          hx-get="/weapon-list"
          hx-target="#weapon-list"
          hx-swap="innerHTML transition:true"
        />
      </div>
      <div id="weapon-list" hx-get="/weapon-list" hx-trigger="load"></div>
    </>
  </Layout>
)

export const weaponsListPage = async ({ query }: { query: { search?: string } }) => {
  try {
    const searchTerm = query.search ?? ""
    const weapons = await getWeapon({
      query: {
        name: searchTerm ? { $like: `%${searchTerm}%` } : undefined,
      },
    })
    return <WeaponList weapons={weapons} />
  } catch (error) {
    console.error("Error fetching weapons:", error)
    return <div class="text-slate-200">Error fetching weapons data</div>
  }
}
