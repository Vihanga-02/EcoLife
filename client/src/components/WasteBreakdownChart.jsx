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


// import {
//   AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
// } from 'recharts'

// export default function WasteBreakdownChart({ data = [] }) {
//   return (
//     <div className="bg-white rounded-2xl p-5 shadow-sm border">
//       <h3 className="text-sm font-bold mb-4">Monthly Waste Breakdown</h3>

//       <div style={{ width: '100%', height: 300 }}>
//         <ResponsiveContainer>
//           <AreaChart data={data}>
//             <defs>
//               <linearGradient id="colorPlastic" x1="0" y1="0" x2="0" y2="1">
//                 <stop offset="5%" stopColor="#2f6f55" stopOpacity={0.8}/>
//                 <stop offset="95%" stopColor="#2f6f55" stopOpacity={0}/>
//               </linearGradient>

//               <linearGradient id="colorPaper" x1="0" y1="0" x2="0" y2="1">
//                 <stop offset="5%" stopColor="#f2c9a9" stopOpacity={0.8}/>
//                 <stop offset="95%" stopColor="#f2c9a9" stopOpacity={0}/>
//               </linearGradient>

//               <linearGradient id="colorGlass" x1="0" y1="0" x2="0" y2="1">
//                 <stop offset="5%" stopColor="#8b5e3c" stopOpacity={0.8}/>
//                 <stop offset="95%" stopColor="#8b5e3c" stopOpacity={0}/>
//               </linearGradient>

//               <linearGradient id="colorOrganic" x1="0" y1="0" x2="0" y2="1">
//                 <stop offset="5%" stopColor="#7ccf8a" stopOpacity={0.8}/>
//                 <stop offset="95%" stopColor="#7ccf8a" stopOpacity={0}/>
//               </linearGradient>

//               <linearGradient id="colorEwaste" x1="0" y1="0" x2="0" y2="1">
//                 <stop offset="5%" stopColor="#e05a5a" stopOpacity={0.8}/>
//                 <stop offset="95%" stopColor="#e05a5a" stopOpacity={0}/>
//               </linearGradient>
//             </defs>

//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="month" />
//             <YAxis />
//             <Tooltip />
//             <Legend />

//             <Area type="monotone" dataKey="Plastic" stroke="#2f6f55" fillOpacity={1} fill="url(#colorPlastic)" />
//             <Area type="monotone" dataKey="Paper" stroke="#f2c9a9" fillOpacity={1} fill="url(#colorPaper)" />
//             <Area type="monotone" dataKey="Glass" stroke="#8b5e3c" fillOpacity={1} fill="url(#colorGlass)" />
//             <Area type="monotone" dataKey="Organic" stroke="#7ccf8a" fillOpacity={1} fill="url(#colorOrganic)" />
//             <Area type="monotone" dataKey="E-waste" stroke="#e05a5a" fillOpacity={1} fill="url(#colorEwaste)" />

//           </AreaChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   )
// }