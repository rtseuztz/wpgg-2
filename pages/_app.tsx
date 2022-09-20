import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Layout from '../components/layout/layout'
import { AuthProvider } from '../components/authContext'

function MyApp({ Component, pageProps }: AppProps) {
  console.log("app running")

  return (
    <AuthProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AuthProvider>
  )
}

export default MyApp