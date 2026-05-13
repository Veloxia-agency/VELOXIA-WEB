import Sidebar from './Sidebar'
import TopBar from './TopBar'

export default function OSLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-black">
      <Sidebar />
      <TopBar />
      <main className="ml-16 pt-11 min-h-screen">
        {children}
      </main>
    </div>
  )
}
