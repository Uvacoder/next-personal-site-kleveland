import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import MainLayout from '../layouts/main';
import { useRouter } from 'next/router'

function Home() {
  
  const router = useRouter();
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        
        </main>
    </div>
  )
}

Home.Layout = MainLayout

export default Home