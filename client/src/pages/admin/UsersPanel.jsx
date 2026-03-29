import { Users } from 'lucide-react'

export default function UsersPanel() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-black">User Management</h2>
        <p className="text-gray-700 text-sm">Manage platform users</p>
      </div>
      <div className="bg-white border border-green-300 rounded-xl p-6 flex items-center justify-center min-h-[300px] text-gray-600 shadow-md">
        <div className="text-center">
          <Users className="text-4xl mx-auto mb-2 text-blue-500" />
          <p>User table and controls will appear here</p>
        </div>
      </div>
    </div>
  )
}
