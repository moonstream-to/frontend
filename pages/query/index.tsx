import { useEffect } from "react"
import Layout from "../../src/components/layout"
import QueryAPIView from "../../src/components/queryAPI/QueryAPIView"
import { QueryAPIProvider } from "../../src/contexts/QueryAPIContext"
import { UserProvider } from "../../src/contexts/UserContext"

const Query = () => {
  useEffect(() => {
    document.title = "Moonstrem portal - Query API"
  }, [])

  return (
    <UserProvider>
      <QueryAPIProvider>
        <Layout home={false}>
          <QueryAPIView />
        </Layout>
      </QueryAPIProvider>
    </UserProvider>
  )
}

export default Query
