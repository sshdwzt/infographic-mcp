import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ShieldCheck, Check, ArrowLeft, Loader2, CreditCard, Smartphone, Building, CheckCircle, Sparkles } from 'lucide-react'

const planInfo = {
  basic: {
    name: '基础版',
    features: ['AI自动记账(50笔/月)', 'OCR发票识别', '基础风险预警', '月度财税报告', '邮件支持'],
    monthlyPrice: 99,
  },
  pro: {
    name: '专业版',
    features: ['AI自动记账(不限量)', 'OCR+NLP智能处理', '全量风险预警+四段式解释', '行业对标分析', '信贷赋能报告', '专属客服'],
    monthlyPrice: 199,
  },
  enterprise: {
    name: '企业版',
    features: ['全部专业版功能', '多主体管理', 'API对接ERP/银行', '定制化规则引擎', '税务优化顾问', '7×24专属服务'],
    monthlyPrice: 299,
  },
}

const paymentMethods = [
  { key: 'alipay', name: '支付宝', icon: Smartphone, color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-200' },
  { key: 'wechat', name: '微信支付', icon: Smartphone, color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  { key: 'card', name: '银行卡', icon: CreditCard, color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-200' },
  { key: 'invoice', name: '对公转账', icon: Building, color: 'text-purple-500', bg: 'bg-purple-50', border: 'border-purple-200' },
]

export default function Payment() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const planKey = params.get('plan') || 'pro'
  const billing = params.get('billing') || 'monthly'
  const [method, setMethod] = useState('alipay')
  const [paying, setPaying] = useState(false)
  const [success, setSuccess] = useState(false)

  const plan = planInfo[planKey] || planInfo.pro
  const isYearly = billing === 'yearly'
  const originalPrice = isYearly ? plan.monthlyPrice * 12 : plan.monthlyPrice
  const discount = isYearly ? Math.round(originalPrice * 0.2) : 0
  const finalPrice = originalPrice - discount

  const handlePay = () => {
    setPaying(true)
    setTimeout(() => {
      setPaying(false)
      setSuccess(true)
    }, 2000)
  }

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }}
            className="w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-50 flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-emerald-500" />
          </motion.div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">支付成功</h2>
          <p className="text-slate-500 mb-2">您已成功订阅 <span className="font-semibold text-cyan-600">{plan.name}</span></p>
          <p className="text-sm text-slate-400 mb-8">
            {isYearly ? '年度方案' : '月度方案'} · ¥{finalPrice}{isYearly ? '/年' : '/月'}
          </p>

          <div className="bg-emerald-50 rounded-xl p-4 mb-8 text-left">
            <p className="text-sm font-medium text-emerald-700 mb-2">已开通服务：</p>
            <div className="space-y-1.5">
              {plan.features.slice(0, 3).map(f => (
                <div key={f} className="flex items-center gap-2 text-xs text-emerald-600">
                  <Check className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>

          <button onClick={() => navigate('/demo/dashboard')}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400 text-white font-semibold hover:shadow-lg hover:shadow-cyan-500/30 transition-all">
            进入工作台
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            返回
          </button>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-cyan-500" />
            <span className="font-bold text-slate-800">财界哨兵Pro</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            安全支付
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-slate-800 mb-8">确认订单</h1>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Left: Order summary */}
          <div className="lg:col-span-3 space-y-6">
            {/* Plan card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-lg text-slate-800">{plan.name}</h3>
                    <span className="px-2 py-0.5 rounded-full bg-cyan-50 text-cyan-600 text-xs font-medium">
                      {isYearly ? '年度方案' : '月度方案'}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500">订阅后即刻开通所有功能</p>
                </div>
                <div className="text-right">
                  <p className="font-kpi text-2xl text-navy-600">¥{finalPrice}</p>
                  <p className="text-xs text-slate-400">{isYearly ? '/年' : '/月'}</p>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4">
                <p className="text-sm font-medium text-slate-600 mb-3">包含功能：</p>
                <div className="grid grid-cols-2 gap-2">
                  {plan.features.map(f => (
                    <div key={f} className="flex items-center gap-2 text-sm text-slate-600">
                      <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Payment method */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h3 className="font-bold text-slate-800 mb-4">选择支付方式</h3>
              <div className="grid grid-cols-2 gap-3">
                {paymentMethods.map(pm => {
                  const Icon = pm.icon
                  const selected = method === pm.key
                  return (
                    <button key={pm.key} onClick={() => setMethod(pm.key)}
                      className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${
                        selected
                          ? `${pm.border} ${pm.bg} shadow-sm`
                          : 'border-slate-100 hover:border-slate-200'
                      }`}>
                      <div className={`w-10 h-10 rounded-lg ${pm.bg} flex items-center justify-center`}>
                        <Icon className={`w-5 h-5 ${pm.color}`} />
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${selected ? 'text-slate-800' : 'text-slate-600'}`}>{pm.name}</p>
                        <p className="text-xs text-slate-400">推荐</p>
                      </div>
                      {selected && <Check className={`w-5 h-5 ${pm.color} ml-auto`} />}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Right: Price breakdown */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sticky top-6">
              <h3 className="font-bold text-slate-800 mb-4">费用明细</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">{plan.name} ({isYearly ? '年付' : '月付'})</span>
                  <span className="text-slate-700">¥{originalPrice}</span>
                </div>
                {isYearly && (
                  <div className="flex justify-between text-emerald-600">
                    <span>年付优惠 (8折)</span>
                    <span>-¥{discount}</span>
                  </div>
                )}
                <div className="border-t border-slate-100 pt-3 flex justify-between">
                  <span className="font-medium text-slate-800">应付金额</span>
                  <span className="font-kpi text-xl text-navy-600">¥{finalPrice}</span>
                </div>
              </div>

              {isYearly && (
                <div className="mt-4 p-3 rounded-lg bg-emerald-50 border border-emerald-100">
                  <div className="flex items-center gap-2 text-xs text-emerald-600">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>年付方案已为您节省 ¥{discount}，相当于每月仅 ¥{Math.round(finalPrice / 12)}</span>
                  </div>
                </div>
              )}

              <button onClick={handlePay} disabled={paying}
                className="w-full mt-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400 text-white font-semibold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-cyan-500/30 disabled:opacity-70 transition-all">
                {paying ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> 支付中...</>
                ) : (
                  <>确认付款 ¥{finalPrice}</>
                )}
              </button>

              <p className="text-center text-xs text-slate-400 mt-4">
                点击付款即表示您同意《服务条款》和《隐私政策》
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
