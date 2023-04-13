import { useEffect } from "react"
import Layout from "../../src/components/layout"
import QueryView from "../../src/components/queryAPI/queryView"
import { QueryAPIProvider } from "../../src/contexts/QueryAPIContext"
import { UserProvider } from "../../src/contexts/UserContext"

const Terminus = () => {
  useEffect(() => {
    document.title = "Moonstrem portal - Terminus"
  }, [])

  return (
    <UserProvider>
      <QueryAPIProvider>
        <Layout home={false}>
          <QueryView />
        </Layout>
      </QueryAPIProvider>
    </UserProvider>
  )
}

export default Terminus
