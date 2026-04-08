import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, Save, Trash2 } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { authAPI } from '../../api/api'

export default function ProfileForm({ open, onClose }) {
  const { user, refreshUser, logout } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (!open) return
    setName(user?.name || '')
    setImageFile(null)
    setPreviewUrl('')
    setCurrentPassword('')
    setNewPassword('')
    setError('')
    setSuccess('')
  }, [open, user?.name])

  useEffect(() => {
    if (!imageFile) return
    const url = URL.createObjectURL(imageFile)
    setPreviewUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [imageFile])

  const changes = useMemo(() => {
    const trimmed = name.trim()
    const nameChanged = !!trimmed && trimmed !== (user?.name || '')
    const imageChanged = !!imageFile
    const passwordChanged = !!currentPassword || !!newPassword
    const passwordReady = !!currentPassword && !!newPassword
    return { nameChanged, imageChanged, passwordChanged, passwordReady, trimmed }
  }, [name, user?.name, imageFile, currentPassword, newPassword])

  if (!open) return null

  const handleSave = async () => {
    setError('')
    setSuccess('')

    if (changes.passwordChanged && !changes.passwordReady) {
      setError('To change password, fill both current password and new password.')
      return
    }

    if (!changes.nameChanged && !changes.imageChanged && !changes.passwordReady) {
      setSuccess('Nothing changed.')
      return
    }

    setSaving(true)
    try {
      // 1) Profile fields (partial)
      if (changes.nameChanged || changes.imageChanged) {
        if (changes.imageChanged) {
          const formData = new FormData()
          if (changes.nameChanged) formData.append('name', changes.trimmed)
          formData.append('image', imageFile)
          await authAPI.updateProfile(formData, { headers: { 'Content-Type': 'multipart/form-data' } })
        } else {
          await authAPI.updateProfile({ ...(changes.nameChanged ? { name: changes.trimmed } : {}) })
        }
      }

      // 2) Password
      if (changes.passwordReady) {
        await authAPI.changePassword({ currentPassword, newPassword })
      }

      await refreshUser()
      setSuccess('Saved successfully.')
      onClose?.()
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to save changes')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    setError('')
    setSuccess('')
    const ok = window.confirm('Are you sure you want to delete your profile? This cannot be undone.')
    if (!ok) return

    setSaving(true)
    try {
      await authAPI.deleteMe()
      logout()
      navigate('/home')
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to delete profile')
    } finally {
      setSaving(false)
    }
  }

  const avatarSrc = previewUrl || user?.profileImage || ''
  const initial = (user?.name || 'U').charAt(0).toUpperCase()

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={() => !saving && onClose?.()} />

      <div className="relative w-full max-w-lg mx-4 bg-white border border-green-300 rounded-2xl shadow-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-green-200">
          <div className="min-w-0">
            <h3 className="text-lg font-bold text-black truncate">Edit Profile</h3>
            <p className="text-xs text-gray-600 truncate">{user?.email}</p>
          </div>
          <button
            onClick={() => !saving && onClose?.()}
            className="p-2 rounded-lg hover:bg-green-50 text-gray-700"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Avatar + upload */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center overflow-hidden shrink-0 border border-green-200">
              {avatarSrc ? (
                <img src={avatarSrc} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-green-700 font-bold text-lg">{initial}</span>
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-black">Profile image (optional)</p>
              <input
                type="file"
                accept="image/*"
                disabled={saving}
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                className="mt-2 block w-full text-sm text-gray-700 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border file:border-green-300 file:bg-green-50 file:text-green-800 hover:file:bg-green-100"
              />
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-black">Name</label>
            <input
              value={name}
              disabled={saving}
              onChange={(e) => setName(e.target.value)}
              className="mt-2 w-full px-3 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
              placeholder="Your name"
            />
          </div>

          {/* Password */}
          <div className="border border-green-200 rounded-xl p-4 bg-green-50/40">
            <p className="text-sm font-semibold text-black mb-3">Change password</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700">Current password</label>
                <input
                  type="password"
                  value={currentPassword}
                  disabled={saving}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700">New password</label>
                <input
                  type="password"
                  value={newPassword}
                  disabled={saving}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
                />
              </div>
            </div>
            <p className="mt-2 text-[11px] text-gray-600">Leave blank if you don’t want to change it.</p>
          </div>

          {error && (
            <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </div>
          )}
          {success && (
            <div className="text-sm text-green-800 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
              {success}
            </div>
          )}
        </div>

        <div className="px-5 py-4 border-t border-green-200 flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
          <button
            onClick={handleDelete}
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-red-200 text-red-700 hover:bg-red-50 transition-colors"
          >
            <Trash2 size={16} />
            Delete profile
          </button>

          <div className="flex gap-2">
            <button
              onClick={() => !saving && onClose?.()}
              className="px-4 py-2 rounded-lg border border-green-300 text-gray-700 hover:bg-green-50 transition-colors"
              disabled={saving}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors disabled:opacity-60"
            >
              <Save size={16} />
              Save changes
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

