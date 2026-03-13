import {
  Users,
  Building2,
  FileText,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts'

const stats = [
  { label: 'Lead Attivi', value: '47', change: '+12%', up: true, icon: Users },
  { label: 'Clienti', value: '23', change: '+3', up: true, icon: Building2 },
  { label: 'Offerte Aperte', value: '€ 142.500', change: '+8%', up: true, icon: FileText },
  { label: 'Fatturato YTD', value: '€ 385.200', change: '-2%', up: false, icon: TrendingUp },
]

const revenueData = [
  { mese: 'Gen', fatturato: 42000 },
  { mese: 'Feb', fatturato: 38000 },
  { mese: 'Mar', fatturato: 45000 },
  { mese: 'Apr', fatturato: 52000 },
  { mese: 'Mag', fatturato: 48000 },
  { mese: 'Giu', fatturato: 61000 },
  { mese: 'Lug', fatturato: 55000 },
  { mese: 'Ago', fatturato: 32000 },
  { mese: 'Set', fatturato: 58000 },
  { mese: 'Ott', fatturato: 64000 },
  { mese: 'Nov', fatturato: 71000 },
  { mese: 'Dic', fatturato: 68000 },
]

const leadData = [
  { mese: 'Gen', inbound: 12, outbound: 8 },
  { mese: 'Feb', inbound: 15, outbound: 10 },
  { mese: 'Mar', inbound: 18, outbound: 14 },
  { mese: 'Apr', inbound: 22, outbound: 11 },
  { mese: 'Mag', inbound: 19, outbound: 16 },
  { mese: 'Giu', inbound: 25, outbound: 13 },
]

export function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Panoramica della tua agenzia</p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <stat.icon className="h-5 w-5 text-muted-foreground" />
                <span
                  className={`flex items-center text-xs font-medium ${
                    stat.up ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {stat.up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                  {stat.change}
                </span>
              </div>
              <div className="mt-3">
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Fatturato Mensile</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="mese" fontSize={12} />
                <YAxis fontSize={12} tickFormatter={(v) => `€${v / 1000}k`} />
                <Tooltip
                  formatter={(value: number) =>
                    new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(value)
                  }
                />
                <Bar dataKey="fatturato" fill="#1e3a5f" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Lead per Canale</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={leadData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="mese" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Line type="monotone" dataKey="inbound" stroke="#1e3a5f" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="outbound" stroke="#d97706" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
