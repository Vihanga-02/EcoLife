import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Navbar from '../../components/common/Navbar'
import Footer from '../../components/common/Footer'
import {
  Zap,
  ShoppingBag,
  Trash2,
  MapPin,
  ArrowRight,
  Award,
  BarChart3,
  BellRing,
  Target,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

const RevealOnScroll = ({ children, className = '', delay = 0 }) => {
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(element)
        }
      },
      { threshold: 0.12 }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

const ServiceImageCard = ({
  image,
  icon,
  title,
  desc,
  to,
  color,
  requiresAuth,
  isAuthenticated,
}) => {
  const navigate = useNavigate()

  const handleClick = (e) => {
    if (requiresAuth && !isAuthenticated) {
      e.preventDefault()
      navigate('/login')
    }
  }

  return (
    <Link
      to={to}
      onClick={handleClick}
      className="group overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_16px_40px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_22px_60px_rgba(16,185,129,0.12)]"
    >
      <div className="relative h-56 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/45 via-slate-900/10 to-transparent" />

        <div className={`absolute left-5 top-5 flex h-12 w-12 items-center justify-center rounded-2xl ${color} shadow-md`}>
          {icon}
        </div>
      </div>

      <div className="p-6">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h3 className="text-xl font-bold text-slate-900">{title}</h3>
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-700 transition-all group-hover:gap-2">
            Explore
            <ArrowRight size={16} />
          </span>
        </div>

        <p className="text-sm leading-7 text-slate-600">{desc}</p>
      </div>
    </Link>
  )
}

const BenefitCard = ({ icon, title, desc, delay = 0 }) => {
  return (
    <RevealOnScroll delay={delay}>
      <div className="h-full rounded-[28px] border border-slate-200 bg-white p-8 shadow-[0_14px_35px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_22px_50px_rgba(15,23,42,0.08)]">
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
          {icon}
        </div>

        <h3 className="text-2xl font-bold text-slate-900">{title}</h3>
        <p className="mt-4 text-base leading-8 text-slate-600">{desc}</p>
      </div>
    </RevealOnScroll>
  )
}

const FeatureCard = ({
  icon,
  title,
  desc,
  to,
  color,
  requiresAuth,
  isAuthenticated,
}) => {
  const navigate = useNavigate()

  const handleClick = (e) => {
    if (requiresAuth && !isAuthenticated) {
      e.preventDefault()
      navigate('/login')
    }
  }

  return (
    <Link
      to={to}
      onClick={handleClick}
      className="bg-white border border-green-300 rounded-xl p-6 hover:border-green-500 transition-all group cursor-pointer block shadow-md"
    >
      <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${color}`}>
        {icon}
      </div>
      <h3 className="mb-2 text-lg font-semibold text-black">{title}</h3>
      <p className="mb-4 text-sm text-gray-700">{desc}</p>
      <span className="flex items-center gap-1.5 text-sm text-green-600 transition-all group-hover:gap-2.5">
        Explore <ArrowRight size={16} />
      </span>
    </Link>
  )
}

export default function HomePage() {
  const { user, isAuthenticated } = useAuth()
  const authenticated = isAuthenticated()

  const serviceCards = [
    {
      image: '/loctor.jpg',
      icon: <MapPin className="text-emerald-700" size={22} />,
      title: 'Recycle Centers',
      desc: 'Locate trusted recycling centers near you and discover better, more responsible ways to dispose of reusable materials.',
      to: '/recycle-centers',
      color: 'bg-emerald-100',
      requiresAuth: false,
    },
    {
      image: '/energy.jpg',
      icon: <Zap className="text-yellow-600" size={22} />,
      title: 'Energy Monitor',
      desc: 'Track appliance usage, view consumption patterns, and estimate your electricity bill with practical energy insights.',
      to: '/dashboard/energy',
      color: 'bg-yellow-100',
      requiresAuth: true,
    },
    {
      image: '/waste.jpg',
      icon: <Trash2 className="text-orange-600" size={22} />,
      title: 'Waste Tracker',
      desc: 'Log waste entries, understand your environmental footprint, and take smarter actions to reduce daily waste.',
      to: '/dashboard/waste',
      color: 'bg-orange-100',
      requiresAuth: true,
    },
    {
      image: '/market.jpg',
      icon: <ShoppingBag className="text-blue-600" size={22} />,
      title: 'Marketplace',
      desc: 'Exchange reusable items, reduce unnecessary waste, and support a more circular community-driven lifestyle.',
      to: '/marketplace',
      color: 'bg-blue-100',
      requiresAuth: false,
    },
  ]

  const features = [
    {
      icon: <Zap className="text-yellow-400" size={22} />,
      title: 'Energy Monitor',
      desc: 'Track appliance usage and estimate your monthly electricity bill.',
      to: '/dashboard/energy',
      color: 'bg-yellow-500/10',
      requiresAuth: true,
    },
    {
      icon: <ShoppingBag className="text-blue-400" size={22} />,
      title: 'Marketplace',
      desc: 'List or claim reusable items and earn Green Score rewards.',
      to: '/marketplace',
      color: 'bg-blue-500/10',
      requiresAuth: false,
    },
    {
      icon: <Trash2 className="text-orange-400" size={22} />,
      title: 'Waste Tracker',
      desc: 'Log your waste and analyse your environmental footprint.',
      to: '/dashboard/waste',
      color: 'bg-orange-500/10',
      requiresAuth: true,
    },
    {
      icon: <MapPin className="text-green-400" size={22} />,
      title: 'Recycle Centers',
      desc: 'Find nearby recycling centers and submit recycling requests.',
      to: '/recycle-centers',
      color: 'bg-green-500/10',
      requiresAuth: false,
    },
  ]

  if (!authenticated) {
    return (
      <div className="flex min-h-screen flex-col bg-[#f7f8f4] text-slate-900">
        <Navbar />

        <main className="flex-1">
          <section className="relative min-h-[720px] overflow-hidden">
            <img
              src="/ecogreen.jpg"
              alt="Eco-friendly lifestyle"
              className="absolute inset-0 h-full w-full object-cover object-[center_right]"
            />

            <div className="absolute inset-0 bg-white/35" />
            <div className="absolute inset-0 bg-gradient-to-r from-white/92 via-white/60 to-transparent" />

            <div className="relative z-10 flex min-h-[720px] items-center px-6 py-16 sm:px-10 lg:px-20 xl:px-28">
              <div className="max-w-3xl">
                <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700">
                  Circular Future Platform
                </p>

                <h1 className="text-5xl font-extrabold leading-[0.92] text-slate-900 sm:text-6xl lg:text-7xl xl:text-8xl">
                  Welcome to <span className="text-emerald-700">EcoLife</span>
                </h1>

                <h2 className="mt-5 text-2xl font-bold leading-tight text-slate-800 sm:text-3xl lg:text-4xl">
                  Small actions, <span className="text-emerald-700">global impact.</span>
                </h2>

                <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
                  Track your footprint, manage waste responsibly, discover recycling options,
                  and make smarter sustainable choices every day with one connected platform.
                </p>

                <div className="mt-10 flex flex-wrap gap-4">
                  <Link
                    to="/signup"
                    className="inline-flex items-center justify-center rounded-2xl bg-emerald-700 px-7 py-4 text-base font-semibold text-white shadow-[0_10px_30px_rgba(5,150,105,0.28)] transition hover:-translate-y-0.5 hover:bg-emerald-800"
                  >
                    Get Started
                  </Link>

                  <Link
                    to="/about"
                    className="inline-flex items-center justify-center rounded-2xl bg-[#efc9aa] px-7 py-4 text-base font-semibold text-[#6f513d] transition hover:-translate-y-0.5 hover:opacity-90"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
            </div>
          </section>

          <section className="w-full bg-[#f4faf7] py-20">
            <div className="w-full px-6 lg:px-10 xl:px-14">
              <RevealOnScroll>
                <div className="mb-12 text-center">
                  <p className="mb-3 text-sm font-semibold uppercase tracking-[0.24em] text-emerald-700">
                    Discover EcoLife
                  </p>
                  <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl lg:text-5xl">
                    Smart tools for everyday sustainable living
                  </h2>
                  <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-slate-600 sm:text-lg">
                    Explore practical features designed to help you monitor energy use, manage waste,
                    discover recycling options, and support a more circular lifestyle with ease.
                  </p>
                </div>
              </RevealOnScroll>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
                {serviceCards.map((card, index) => (
                  <RevealOnScroll key={card.title} delay={index * 120}>
                    <ServiceImageCard
                      {...card}
                      isAuthenticated={authenticated}
                    />
                  </RevealOnScroll>
                ))}
              </div>
            </div>
          </section>

          <section className="w-full bg-white py-24">
            <div className="w-full px-6 lg:px-10 xl:px-14">
              <RevealOnScroll>
                <div className="mb-14 text-center">
                  <div className="mx-auto mb-5 h-1.5 w-20 rounded-full bg-emerald-600" />
                  <p className="mb-3 text-sm font-semibold uppercase tracking-[0.24em] text-emerald-700">
                    Why Choose EcoLife
                  </p>
                  <h2 className="mx-auto max-w-5xl text-4xl font-extrabold leading-tight text-slate-900 lg:text-5xl">
                    A cleaner, smarter way to build sustainable habits
                  </h2>
                  <p className="mx-auto mt-6 max-w-4xl text-lg leading-9 text-slate-600">
                    EcoLife gives users simple and practical tools to monitor progress, reduce waste,
                    and make more responsible choices every day. Everything is designed to feel clear,
                    modern, and useful in real life.
                  </p>
                </div>
              </RevealOnScroll>

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <BenefitCard
                  icon={<BarChart3 size={26} />}
                  title="Data-Driven Insights"
                  desc="Understand your habits through clear tracking and practical progress views that help you make better eco decisions."
                  delay={0}
                />
                <BenefitCard
                  icon={<BellRing size={26} />}
                  title="Smart Daily Actions"
                  desc="Use simple tools that make sustainable living easier, from energy monitoring to waste logging and local recycling support."
                  delay={120}
                />
                <BenefitCard
                  icon={<Target size={26} />}
                  title="Long-Term Impact"
                  desc="Turn small everyday actions into meaningful long-term change by building better habits with one connected platform."
                  delay={240}
                />
              </div>
            </div>
          </section>

          <section className="w-full py-24">
            <RevealOnScroll>
              <div className="w-full bg-gradient-to-r from-emerald-700 via-green-700 to-emerald-600 px-8 py-16 text-white shadow-[0_25px_80px_rgba(16,185,129,0.20)] lg:px-16">
                <div className="mx-auto max-w-4xl text-center">
                  <p className="mb-4 text-sm font-semibold uppercase tracking-[0.28em] text-emerald-100">
                    Start Your Eco Journey
                  </p>

                  <h2 className="text-4xl font-extrabold leading-tight sm:text-5xl">
                    Ready to live greener with EcoLife?
                  </h2>

                  <p className="mx-auto mt-6 max-w-3xl text-lg leading-9 text-green-50/90">
                    Join a smarter way of living by tracking your energy, reducing waste,
                    discovering recycling options, and making everyday sustainable choices
                    with one connected platform.
                  </p>

                  <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                    <Link
                      to="/Signup"
                      className="inline-flex min-w-[190px] items-center justify-center rounded-2xl bg-white px-7 py-4 text-base font-semibold text-emerald-700 shadow-lg transition duration-300 hover:-translate-y-0.5 hover:bg-emerald-50"
                    >
                      Get Started Free
                    </Link>

                    <Link
                      to="/about"
                      className="inline-flex min-w-[190px] items-center justify-center rounded-2xl border border-white/30 bg-white/10 px-7 py-4 text-base font-semibold text-white backdrop-blur-sm transition duration-300 hover:-translate-y-0.5 hover:bg-white/15"
                    >
                      Explore EcoLife
                    </Link>
                  </div>

                  <div className="mt-12 grid grid-cols-1 gap-4 text-left sm:grid-cols-3">
                    <div className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm">
                      <h4 className="text-2xl font-bold">Track</h4>
                      <p className="mt-2 text-sm leading-7 text-green-50/90">
                        Monitor energy use and understand your daily environmental impact.
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm">
                      <h4 className="text-2xl font-bold">Reduce</h4>
                      <p className="mt-2 text-sm leading-7 text-green-50/90">
                        Cut waste and build better sustainable habits with practical tools.
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm">
                      <h4 className="text-2xl font-bold">Reuse</h4>
                      <p className="mt-2 text-sm leading-7 text-green-50/90">
                        Support circular living through recycling centers and marketplace sharing.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </RevealOnScroll>
          </section>
        </main>

        <Footer />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-green-500 to-white">
      <Navbar />

      <div className="mx-auto flex-1 max-w-7xl px-4 py-8">
        <div className="mb-8">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-green-300 bg-green-100 px-3 py-1 text-xs text-green-700">
            <Award className="h-4 w-4" />
            Green Score: {user?.greenScore || 0} points
          </div>

          <h1 className="mb-3 text-3xl font-bold text-black md:text-4xl">
            Welcome back, <span className="text-green-700">{user?.name?.split(' ')[0]}</span> 👋
          </h1>

          <p className="max-w-xl text-base text-gray-700">
            Track your impact, reuse smarter, and earn Green Score points for every sustainable action you take.
          </p>
        </div>

        <div className="mb-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <FeatureCard
              key={feature.title}
              {...feature}
              isAuthenticated={authenticated}
            />
          ))}
        </div>

        <div className="rounded-xl border border-green-300 bg-white p-6 shadow-md">
          <h2 className="mb-4 text-lg font-semibold text-black">Your Summary</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              { label: 'Green Score', value: user?.greenScore || 0, unit: 'pts' },
              { label: 'Transactions', value: user?.totalTransactions || 0, unit: 'trades' },
              { label: 'Waste Logged', value: '—', unit: 'entries' },
              { label: 'Carbon Saved', value: '—', unit: 'kg CO₂' },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-green-200 bg-green-50 p-4 text-center"
              >
                <p className="text-2xl font-bold text-green-600">{item.value}</p>
                <p className="mt-1 text-xs text-gray-600">{item.unit}</p>
                <p className="text-sm text-gray-700">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}