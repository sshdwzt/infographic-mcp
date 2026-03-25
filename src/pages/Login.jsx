import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ShieldCheck, Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, User as UserIcon } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

function FloatingParticle({ delay, duration, x, y, size }) {
  return (
    <motion.div
      className="absolute rounded-full bg-cyan-400/20"
      style={{ width: size, height: size, left: `${x}%`, top: `${y}%` }}
      animate={{ y: [0, -30, 0], opacity: [0.2, 0.6, 0.2] }}
      transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut' }}
    />
  )
}

const particles = Array.from({ length: 15 }, (_, i) => ({
  delay: i * 0.4,
  duration: 3 + Math.random() * 3,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: 4 + Math.random() * 8,
}))

export default function Login() {
  const navigate = useNavigate()
  const { login, register, isLoggedIn } = useAuth()
  const [mode, setMode] = useState('login')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [regName, setRegName] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPw, setRegPw] = useState('')
  const [regPw2, setRegPw2] = useState('')

  const emailRef = useRef(null)

  useEffect(() => {
    if (isLoggedIn) navigate('/demo/dashboard')
  }, [isLoggedIn, navigate])

  useEffect(() => { emailRef.current?.focus() }, [mode])

  const handleLogin = (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      login(email || 'demo@sentinel.com')
      setLoading(false)
      navigate('/demo/dashboard')
    }, 1500)
  }

  const handleRegister = (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      register(regName || '新用户', regEmail || 'user@sentinel.com')
      setLoading(false)
      navigate('/demo/dashboard')
    }, 1500)
  }

  const handleThirdParty = () => {
    setLoading(true)
    setTimeout(() => {
      login('wechat_user@sentinel.com')
      setLoading(false)
      navigate('/demo/dashboard')
    }, 1500)
  }

  return (
    <div className="min-h-screen flex">
      {/* Left: Brand */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-navy-900 via-navy-700 to-cyan-700 items-center justify-center overflow-hidden">
        <div className="absolute inset-0 hero-grid opacity-20" />
        {particles.map((p, i) => <FloatingParticle key={i} {...p} />)}

        <div className="relative z-10 max-w-md px-12 text-center">
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}>
            <div className="w-20 h-20 mx-auto mb-8 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center border border-white/20">
              <ShieldCheck className="w-10 h-10 text-cyan-400" />
            </div>
            <h1 className="text-4xl font-black text-white mb-3">
              财界哨兵<span className="text-gradient">Pro</span>
            </h1>
            <p className="text-cyan-100/70 text-lg mb-8">AI驱动的智能财税风控平台</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="grid grid-cols-3 gap-4">
            {[
              { val: '200+', label: '风控规则' },
              { val: '98%', label: '识别准确率' },
              { val: '70%', label: '成本降低' },
            ].map((s, i) => (
              <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur">
                <p className="font-kpi text-2xl text-cyan-400">{s.val}</p>
                <p className="text-xs text-white/50 mt-1">{s.label}</p>
              </div>
            ))}
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
            className="mt-12 flex items-center gap-3 justify-center text-white/40 text-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            系统运行正常 · 数据已加密
          </motion.div>
        </div>
      </div>

      {/* Right: Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-slate-50">
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
          className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-navy-700 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
            </div>
            <span className="text-xl font-bold text-slate-800">财界哨兵<span className="text-gradient">Pro</span></span>
          </div>

          {/* Mode tabs */}
          <div className="flex gap-1 bg-slate-100 rounded-xl p-1 mb-8">
            <button onClick={() => setMode('login')}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                mode === 'login' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}>
              登录
            </button>
            <button onClick={() => setMode('register')}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                mode === 'register' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}>
              注册
            </button>
          </div>

          <AnimatePresence mode="wait">
            {mode === 'login' ? (
              <motion.div key="login"
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">欢迎回来</h2>
                <p className="text-slate-500 mb-6">登录以访问您的智能财税工作台</p>

                <form onSubmit={handleLogin} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1.5">邮箱 / 手机号</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input ref={emailRef} type="text" value={email} onChange={e => setEmail(e.target.value)}
                        placeholder="demo@sentinel.com"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1.5">密码</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                        placeholder="输入密码"
                        className="w-full pl-10 pr-11 py-3 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-slate-300 text-cyan-500 focus:ring-cyan-500" />
                      <span className="text-slate-600">记住我</span>
                    </label>
                    <button type="button" className="text-cyan-600 hover:text-cyan-700 font-medium">忘记密码？</button>
                  </div>

                  <button type="submit" disabled={loading}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400 text-white font-semibold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-cyan-500/30 disabled:opacity-70 transition-all">
                    {loading ? (
                      <><Loader2 className="w-5 h-5 animate-spin" /> 登录中...</>
                    ) : (
                      <>进入工作台 <ArrowRight className="w-4 h-4" /></>
                    )}
                  </button>
                </form>

                <div className="my-8 flex items-center gap-4">
                  <div className="flex-1 h-px bg-slate-200" />
                  <span className="text-xs text-slate-400">或使用以下方式登录</span>
                  <div className="flex-1 h-px bg-slate-200" />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {['微信', '钉钉', '企微'].map(name => (
                    <button key={name} onClick={handleThirdParty}
                      className="py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-600 font-medium hover:bg-slate-50 hover:border-slate-300 transition-all">
                      {name}
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div key="register"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">创建账户</h2>
                <p className="text-slate-500 mb-6">注册即可免费体验所有核心功能</p>

                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1.5">用户名</label>
                    <div className="relative">
                      <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input ref={mode === 'register' ? emailRef : undefined} type="text" value={regName} onChange={e => setRegName(e.target.value)}
                        placeholder="您的姓名"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1.5">邮箱 / 手机号</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input type="text" value={regEmail} onChange={e => setRegEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1.5">设置密码</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input type={showPassword ? 'text' : 'password'} value={regPw} onChange={e => setRegPw(e.target.value)}
                        placeholder="至少6位密码"
                        className="w-full pl-10 pr-11 py-3 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1.5">确认密码</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input type="password" value={regPw2} onChange={e => setRegPw2(e.target.value)}
                        placeholder="再次输入密码"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all" />
                    </div>
                  </div>

                  <button type="submit" disabled={loading}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400 text-white font-semibold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-cyan-500/30 disabled:opacity-70 transition-all">
                    {loading ? (
                      <><Loader2 className="w-5 h-5 animate-spin" /> 注册中...</>
                    ) : (
                      <>免费注册 <ArrowRight className="w-4 h-4" /></>
                    )}
                  </button>

                  <p className="text-center text-xs text-slate-400 mt-2">
                    注册即表示同意《服务条款》和《隐私政策》
                  </p>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  )
}
