import Head from 'next/head'
import Layout from '../src/components/layout'

export default function Home() {
  return (
    <Layout home={true}>
      <Head>
        <title>Moonstream portal</title>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.png' />
      </Head>
    </Layout>
  )
}
