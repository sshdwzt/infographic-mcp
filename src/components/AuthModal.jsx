import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Mail, Lock, Eye, EyeOff, User as UserIcon, Loader2, ShieldCheck } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function AuthModal({ open, onClose, onSuccess, defaultTab = 'login' }) {
  const { login, register } = useAuth()
  const [tab, setTab] = useState(defaultTab)
  const [loading, setLoading] = useState(false)
  const [showPw, setShowPw] = useState(false)

  const [loginEmail, setLoginEmail] = useState('')
  const [loginPw, setLoginPw] = useState('')

  const [regName, setRegName] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPw, setRegPw] = useState('')
  const [regPw2, setRegPw2] = useState('')

  const inputRef = useRef(null)

  useEffect(() => {
    if (open) {
      setTab(defaultTab)
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [open, defaultTab])

  const handleLogin = (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      login(loginEmail || 'demo@sentinel.com')
      setLoading(false)
      onSuccess?.()
      onClose()
    }, 1000)
  }

  const handleRegister = (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      register(regName || '新用户', regEmail || 'user@sentinel.com')
      setLoading(false)
      onSuccess?.()
      onClose()
    }, 1000)
  }

  const handleThirdParty = () => {
    setLoading(true)
    setTimeout(() => {
      login('wechat_user@sentinel.com')
      setLoading(false)
      onSuccess?.()
      onClose()
    }, 1000)
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-navy-700 to-navy-600 px-6 py-5 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <p className="font-bold">财界哨兵Pro</p>
                    <p className="text-xs text-white/50">{tab === 'login' ? '登录您的账户' : '创建新账户'}</p>
                  </div>
                </div>
                <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex gap-1 mt-4 bg-white/10 rounded-lg p-1">
                {[
                  { key: 'login', label: '登录' },
                  { key: 'register', label: '注册' },
                ].map(t => (
                  <button key={t.key} onClick={() => setTab(t.key)}
                    className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${
                      tab === t.key ? 'bg-white text-navy-700 shadow' : 'text-white/70 hover:text-white'
                    }`}>
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Body */}
            <div className="p-6">
              <AnimatePresence mode="wait">
                {tab === 'login' ? (
                  <motion.form key="login" onSubmit={handleLogin}
                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-1">邮箱 / 手机号</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input ref={inputRef} type="text" value={loginEmail} onChange={e => setLoginEmail(e.target.value)}
                          placeholder="demo@sentinel.com"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-1">密码</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input type={showPw ? 'text' : 'password'} value={loginPw} onChange={e => setLoginPw(e.target.value)}
                          placeholder="输入密码"
                          className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent" />
                        <button type="button" onClick={() => setShowPw(!showPw)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                          {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <button type="submit" disabled={loading}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400 text-white font-semibold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-cyan-500/30 disabled:opacity-70 transition-all">
                      {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> 登录中...</> : '登录'}
                    </button>

                    <div className="flex items-center gap-3 my-3">
                      <div className="flex-1 h-px bg-slate-200" />
                      <span className="text-xs text-slate-400">快捷登录</span>
                      <div className="flex-1 h-px bg-slate-200" />
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {['微信', '钉钉', '企微'].map(n => (
                        <button key={n} type="button" onClick={handleThirdParty}
                          className="py-2 rounded-xl border border-slate-200 text-xs text-slate-600 font-medium hover:bg-slate-50 transition-all">
                          {n}
                        </button>
                      ))}
                    </div>
                  </motion.form>
                ) : (
                  <motion.form key="register" onSubmit={handleRegister}
                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-1">用户名</label>
                      <div className="relative">
                        <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input type="text" value={regName} onChange={e => setRegName(e.target.value)}
                          placeholder="您的姓名"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-1">邮箱 / 手机号</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input type="text" value={regEmail} onChange={e => setRegEmail(e.target.value)}
                          placeholder="your@email.com"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-1">设置密码</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input type={showPw ? 'text' : 'password'} value={regPw} onChange={e => setRegPw(e.target.value)}
                          placeholder="至少6位密码"
                          className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent" />
                        <button type="button" onClick={() => setShowPw(!showPw)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                          {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-1">确认密码</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input type="password" value={regPw2} onChange={e => setRegPw2(e.target.value)}
                          placeholder="再次输入密码"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent" />
                      </div>
                    </div>
                    <button type="submit" disabled={loading}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400 text-white font-semibold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-cyan-500/30 disabled:opacity-70 transition-all">
                      {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> 注册中...</> : '免费注册'}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
