import { Html } from "@elysiajs/html"
import { Layout } from "../layout"
import { SearchBar } from "../components/SearchBar"
import { WeaponList } from "../components"
import { getWeapon } from "../backend/routes"

export const weaponsPage = () => (
  <Layout>
    <>
      <h1 class="mb-2 text-center text-3xl font-bold">Weapons</h1>
      <SearchBar placeholder="Search weapons..." target="weapon-list" endpoint="/weapon-list" />
      <div
        id="weapon-list"
        hx-get="/weapon-list"
        hx-trigger="load"
        hx-target="#weapon-list"
        hx-swap="innerHTML transition:true"
      ></div>
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
