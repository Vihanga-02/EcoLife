import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

export default function WasteBreakdownChart({ data = [] }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-gray-800">Monthly Waste Breakdown</h3>

        <div className="px-4 py-2 rounded-full bg-gray-100 text-gray-600 text-sm font-semibold">
          6 Months
        </div>
      </div>

      <div className="h-[320px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6B7280' }} />
            <YAxis tick={{ fontSize: 12, fill: '#6B7280' }} />
            <Tooltip />
            <Legend />

            <Line type="monotone" dataKey="Plastic" stroke="#2f6f55" strokeWidth={3} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="Paper" stroke="#f2c9a9" strokeWidth={3} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="Glass" stroke="#8b5e3c" strokeWidth={3} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="Organic" stroke="#6cc17f" strokeWidth={3} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="E-waste" stroke="#e35d5d" strokeWidth={3} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

