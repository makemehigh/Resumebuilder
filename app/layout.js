import './globals.css'
import { Inter } from 'next/font/google'
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
import AuthInitializer from './AuthInitializer'

config.autoAddCss = false

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Resume Builder - Build Your Dream Resume',
  description: 'Create professional resumes for free with our easy-to-use resume builder',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthInitializer />
        {children}
        <div id="date-picker-portal"></div>
      </body>
    </html>
  )
}
