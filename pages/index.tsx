import Head from 'next/head'
import styles from '../src/styles/Home.module.css'
import Layout from '../src/components/layout'

export default function Home() {
  return (
    <Layout>
      <Head>
        <title>Moonstream portal</title>
        <meta name='description' content='Moonstream apps portal' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.png' />
      </Head>
      <main className={styles.main}></main>
    </Layout>
  )
}
