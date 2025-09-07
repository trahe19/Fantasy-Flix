import './globals.css'
import { Poppins, JetBrains_Mono } from 'next/font/google'
import { AuthProvider } from '../contexts/AuthContext'

const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-poppins'
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-mono'
})

export const metadata = {
  title: "Fantasy Flix",
  description: 'The ultimate fantasy movie league. Draft blockbusters, predict box office success, and compete for the championship.',
  icons: {
    icon: '/logo-sleek.svg',
    apple: '/logo-sleek.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} ${jetbrainsMono.variable} font-sans`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}