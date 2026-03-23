const API_KEY = process.env.API_KEY

if (!API_KEY) {
  console.error("API_KEY is not set in environment variables")
  process.exit(1)
}

export const checkAuth = ({ headers }: { headers: { authorization: string } }) => {
  if (!headers.authorization || !headers.authorization.startsWith("Bearer ")) {
    throw new Error("Missing or invalid Authorization header")
  }
  const token = headers.authorization.split(" ")[1]
  if (token !== API_KEY) {
    throw new Error("Invalid API key")
  }
}
