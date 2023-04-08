import { useEffect } from "react"
import Layout from "../../src/components/layout"
import TerminusView from "../../src/components/terminus/TerminusView"
import { TerminusProvider } from "../../src/contexts/TerminusContext"

const Terminus = () => {
  useEffect(() => {
    document.title = "Moonstrem portal - Terminus"
  }, [])

  return (
    <TerminusProvider>
      <Layout home={false}>
        <TerminusView />
      </Layout>
    </TerminusProvider>
  )
}

export default Terminus
