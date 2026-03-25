import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Sparkles } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import AuthModal from '../AuthModal'

const plans = [
  {
    key: 'basic',
    name: '基础版',
    monthlyPrice: 99,
    desc: '适合初创微型企业',
    features: ['AI自动记账(50笔/月)', 'OCR发票识别', '基础风险预警', '月度财税报告', '邮件支持'],
    highlight: false,
  },
  {
    key: 'pro',
    name: '专业版',
    monthlyPrice: 199,
    desc: '适合成长型中小企业',
    features: ['AI自动记账(不限量)', 'OCR+NLP智能处理', '全量风险预警+四段式解释', '行业对标分析', '信贷赋能报告', '专属客服'],
    highlight: true,
  },
  {
    key: 'enterprise',
    name: '企业版',
    monthlyPrice: 299,
    desc: '适合规模化企业',
    features: ['全部专业版功能', '多主体管理', 'API对接ERP/银行', '定制化规则引擎', '税务优化顾问', '7×24专属服务'],
    highlight: false,
  },
]

export default function Pricing() {
  const [billing, setBilling] = useState('monthly')
  const [authOpen, setAuthOpen] = useState(false)
  const [pendingPlan, setPendingPlan] = useState(null)
  const { isLoggedIn } = useAuth()
  const navigate = useNavigate()

  const discount = 0.8

  const getPrice = (plan) => {
    if (billing === 'yearly') return Math.round(plan.monthlyPrice * 12 * discount)
    return plan.monthlyPrice
  }

  const handleSelect = (plan) => {
    const target = `/payment?plan=${plan.key}&billing=${billing}`
    if (isLoggedIn) {
      navigate(target)
    } else {
      setPendingPlan(target)
      setAuthOpen(true)
    }
  }

  const onAuthSuccess = () => {
    if (pendingPlan) {
      navigate(pendingPlan)
      setPendingPlan(null)
    }
  }

  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-500/10 border border-gold-500/20 mb-6">
            <Sparkles className="w-4 h-4 text-gold-500 animate-pulse" />
            <span className="text-sm text-gold-600 font-medium">定价方案</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-3">灵活定价，按需选择</h2>
          <p className="text-slate-500 mb-8">选择适合您企业规模的方案，随时可升级</p>

          {/* Billing toggle */}
          <div className="inline-flex items-center gap-3 bg-slate-100 rounded-xl p-1.5">
            <button onClick={() => setBilling('monthly')}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                billing === 'monthly' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}>
              按月付费
            </button>
            <button onClick={() => setBilling('yearly')}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                billing === 'yearly' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}>
              按年付费
              <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-xs font-bold">省20%</span>
            </button>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan, i) => {
            const price = getPrice(plan)
            return (
              <motion.div key={plan.key} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className={`relative p-8 rounded-2xl border transition-all ${plan.highlight ? 'border-navy-600 shadow-xl shadow-navy-600/10 scale-105' : 'border-slate-200 hover:shadow-lg'}`}>
                {plan.highlight && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-cyan-500 to-navy-600 text-white text-xs font-medium">
                    推荐
                  </span>
                )}
                <h3 className="text-lg font-bold text-slate-800 mb-1">{plan.name}</h3>
                <p className="text-sm text-slate-500 mb-4">{plan.desc}</p>
                <div className="mb-6">
                  <AnimatePresence mode="wait">
                    <motion.span key={`${plan.key}-${billing}`}
                      initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="inline-block font-kpi text-4xl text-navy-600">
                      ¥{price}
                    </motion.span>
                  </AnimatePresence>
                  <span className="text-slate-400 text-sm">{billing === 'yearly' ? '/年' : '/月'}</span>
                  {billing === 'yearly' && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className="text-xs text-emerald-500 mt-1">
                      相当于 ¥{Math.round(price / 12)}/月，省 ¥{plan.monthlyPrice * 12 - price}
                    </motion.p>
                  )}
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-start gap-2 text-sm text-slate-600">
                      <Check className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <button onClick={() => handleSelect(plan)}
                  className={`w-full py-2.5 rounded-xl text-sm font-medium transition-all ${plan.highlight ? 'bg-navy-600 text-white hover:bg-navy-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
                  选择方案
                </button>
              </motion.div>
            )
          })}
        </div>
      </div>

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} onSuccess={onAuthSuccess} />
    </section>
  )
}
