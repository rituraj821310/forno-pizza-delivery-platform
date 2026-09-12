import { useMemo, useState } from 'react'
import {
  FiSearch,
  FiTrash2,
  FiShield,
  FiUser,
} from 'react-icons/fi'

import { useFetch } from '../../hooks/useFetch.js'

import {
  fetchUsers,
  updateUserRole,
  deleteUser,
} from '../../services/userService.js'

import Loader from '../../components/Loader.jsx'
import ErrorBanner from '../../components/ErrorBanner.jsx'

function formatDate(date) {
  if (!date) return '—'

  return new Date(date).toLocaleDateString(
    'en-IN',
    {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }
  )
}

export default function ManageUsers() {
  const {
    data,
    loading,
    error: fetchError,
    refetch,
  } = useFetch(() => fetchUsers(), [])

  const users = data?.users ?? data ?? []

  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')

  const [error, setError] = useState('')
  const [updatingId, setUpdatingId] = useState(null)

  const filteredUsers = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase()

    return users.filter((user) => {
      const matchesSearch =
        !query ||
        user.name
          ?.toLowerCase()
          .includes(query) ||
        user.email
          ?.toLowerCase()
          .includes(query)

      const matchesRole =
        roleFilter === 'all' ||
        user.role === roleFilter

      return (
        matchesSearch &&
        matchesRole
      )
    })
  }, [users, search, roleFilter])

  async function handleRoleChange(user, role) {
    const id = user._id || user.id

    if (user.role === role) {
      return
    }

    try {
      setError('')
      setUpdatingId(id)

      await updateUserRole(id, role)

      await refetch()
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          'Could not update user role.'
      )
    } finally {
      setUpdatingId(null)
    }
  }

  async function handleDelete(user) {
    const id = user._id || user.id

    if (
      !window.confirm(
        `Remove "${user.name}" from the system?`
      )
    ) {
      return
    }

    try {
      setError('')
      setUpdatingId(id)

      await deleteUser(id)

      await refetch()
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          'Could not remove user.'
      )
    } finally {
      setUpdatingId(null)
    }
  }

  const customerCount = users.filter(
    (user) => user.role === 'customer'
  ).length

  const adminCount = users.filter(
    (user) => user.role === 'admin'
  ).length

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-tomato">
          Admin
        </p>

        <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-900">
          User Management
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Manage customer accounts and admin access.
        </p>
      </div>

      {/* Errors */}
      {(error || fetchError) && (
        <ErrorBanner
          message={
            error ||
            fetchError ||
            'Could not load users.'
          }
        />
      )}

      {/* Summary */}
      <div className="grid gap-5 sm:grid-cols-3">
        <div className="card flex items-center gap-4 p-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-600">
            <FiUser size={22} />
          </div>

          <div>
            <p className="text-sm text-slate-500">
              Total Users
            </p>

            <p className="mt-1 text-2xl font-black text-slate-900">
              {users.length}
            </p>
          </div>
        </div>

        <div className="card flex items-center gap-4 p-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
            <FiUser size={22} />
          </div>

          <div>
            <p className="text-sm text-slate-500">
              Customers
            </p>

            <p className="mt-1 text-2xl font-black text-slate-900">
              {customerCount}
            </p>
          </div>
        </div>

        <div className="card flex items-center gap-4 p-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
            <FiShield size={22} />
          </div>

          <div>
            <p className="text-sm text-slate-500">
              Admins
            </p>

            <p className="mt-1 text-2xl font-black text-slate-900">
              {adminCount}
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-5">
        <div className="grid gap-4 md:grid-cols-[1fr_220px]">
          <div className="relative">
            <FiSearch
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />

            <input
              type="search"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search by name or email..."
              className="input-field w-full pl-11"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) =>
              setRoleFilter(e.target.value)
            }
            className="input-field"
          >
            <option value="all">
              All roles
            </option>

            <option value="customer">
              Customers
            </option>

            <option value="admin">
              Admins
            </option>
          </select>
        </div>

        <p className="mt-4 text-sm text-slate-500">
          {filteredUsers.length} user
          {filteredUsers.length !== 1
            ? 's'
            : ''}{' '}
          found
        </p>
      </div>

      {/* Users */}
      {loading ? (
        <Loader label="Loading users..." />
      ) : filteredUsers.length === 0 ? (
        <div className="card p-12 text-center">
          <FiUser
            className="mx-auto text-slate-300"
            size={38}
          />

          <p className="mt-4 font-semibold text-slate-700">
            No users found
          </p>

          <p className="mt-1 text-sm text-slate-400">
            Try changing your search or filter.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          {/* Desktop Header */}
          <div className="hidden border-b border-slate-100 bg-slate-50 px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400 md:grid md:grid-cols-[1.5fr_1.5fr_160px_140px_100px] md:gap-4">
            <span>User</span>
            <span>Email</span>
            <span>Role</span>
            <span>Joined</span>
            <span>Action</span>
          </div>

          <div className="divide-y divide-slate-100">
            {filteredUsers.map((user) => {
              const id =
                user._id || user.id

              const isUpdating =
                updatingId === id

              return (
                <div
                  key={id}
                  className="px-6 py-5"
                >
                  <div className="grid gap-4 md:grid-cols-[1.5fr_1.5fr_160px_140px_100px] md:items-center md:gap-4">
                    {/* User */}
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-100 font-bold text-slate-600">
                        {user.name
                          ?.charAt(0)
                          ?.toUpperCase() ||
                          '?'}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate font-bold text-slate-900">
                          {user.name}
                        </p>

                        <p className="mt-1 text-xs text-slate-400 md:hidden">
                          {user.email}
                        </p>
                      </div>
                    </div>

                    {/* Email */}
                    <p className="hidden truncate text-sm text-slate-500 md:block">
                      {user.email}
                    </p>

                    {/* Role */}
                    <div>
                      <select
                        value={
                          user.role ||
                          'customer'
                        }
                        onChange={(e) =>
                          handleRoleChange(
                            user,
                            e.target.value
                          )
                        }
                        disabled={
                          isUpdating
                        }
                        className={`rounded-xl border px-3 py-2 text-sm font-semibold outline-none transition ${
                          user.role === 'admin'
                            ? 'border-purple-200 bg-purple-50 text-purple-700'
                            : 'border-slate-200 bg-slate-50 text-slate-700'
                        }`}
                      >
                        <option value="customer">
                          Customer
                        </option>

                        <option value="admin">
                          Admin
                        </option>
                      </select>
                    </div>

                    {/* Joined */}
                    <p className="text-sm text-slate-500">
                      <span className="font-medium text-slate-400 md:hidden">
                        Joined:{' '}
                      </span>

                      {formatDate(
                        user.createdAt
                      )}
                    </p>

                    {/* Delete */}
                    <div>
                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(
                            user
                          )
                        }
                        disabled={
                          isUpdating
                        }
                        className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-tomato transition hover:bg-tomato/10 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <FiTrash2 />

                        <span className="md:hidden">
                          Delete
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}