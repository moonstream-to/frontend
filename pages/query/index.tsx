import { useEffect } from "react"
import Layout from "../../src/components/layout"
import { UserProvider } from "../../src/contexts/UserContext"

const Terminus = () => {
  useEffect(() => {
    document.title = "Moonstrem portal - Terminus"
  }, [])

  return (
    <UserProvider>
      <Layout home={false}></Layout>
    </UserProvider>
  )
}

export default Terminus
