import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import LoginPage from './LoginPage'
import AdminEditor from './AdminEditor'
import './admin.css'

export default function AdminApp() {
  // undefined = loading; null = logged out; object = logged in
  const [session, setSession] = useState(undefined)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session ?? null))

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  if (session === undefined) {
    return (
      <div className="admin-wrapper">
        <div className="admin-panel">
          <div className="admin-title">Quản Trị Dí Tới</div>
          <div className="status-msg">Đang kiểm tra đăng nhập...</div>
        </div>
      </div>
    )
  }

  return session ? <AdminEditor session={session} /> : <LoginPage />
}
