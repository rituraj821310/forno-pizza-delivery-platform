import { useEffect, useState } from 'react'
import {
  FiSearch,
  FiX,
  FiImage,
} from 'react-icons/fi'

import { useFetch } from '../../hooks/useFetch.js'

import {
  fetchAdminMenu,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from '../../services/menuService.js'

import Loader from '../../components/Loader.jsx'
import ErrorBanner from '../../components/ErrorBanner.jsx'
import FormField from '../../components/FormField.jsx'

import { formatCurrency } from '../../utils/formatCurrency.js'

const CATEGORIES = [
  'Classic',
  'Specialty',
  'Vegetarian',
  'Sides',
  'Drinks',
]

const EMPTY_FORM = {
  name: '',
  description: '',
  basePrice: '',
  category: 'Classic',
  image: '',
  tags: '',
}

export default function ManageMenu() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')

  const {
    data,
    loading,
    error: fetchError,
    refetch,
  } = useFetch(
    () =>
      fetchAdminMenu({
        ...(search.trim()
          ? { search: search.trim() }
          : {}),
        ...(category
          ? { category }
          : {}),
      }),
    [search, category]
  )

  const items = data?.items ?? data ?? []

  const [form, setForm] = useState(EMPTY_FORM)
  const [editingId, setEditingId] = useState(null)

  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [updatingId, setUpdatingId] = useState(null)

  function handleChange(e) {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  function startEdit(item) {
    setEditingId(item._id || item.id)

    setForm({
      name: item.name || '',
      description: item.description || '',
      basePrice: item.basePrice ?? '',
      category: item.category || 'Classic',
      image: item.image || '',
      tags: Array.isArray(item.tags)
        ? item.tags.join(', ')
        : item.tags || '',
    })

    setError('')
  }

  function resetForm() {
    setEditingId(null)
    setForm(EMPTY_FORM)
    setError('')
  }

  function clearFilters() {
    setSearch('')
    setCategory('')
  }

  async function handleSubmit(e) {
    e.preventDefault()

    setSubmitting(true)
    setError('')

    try {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        basePrice: Number(form.basePrice),
        category: form.category,
        image: form.image.trim(),
        tags: form.tags
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean),
      }

      if (editingId) {
        await updateMenuItem(
          editingId,
          payload
        )
      } else {
        await createMenuItem(payload)
      }

      resetForm()
      await refetch()
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          'Could not save this dish.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(item) {
    const id = item._id || item.id

    if (
      !window.confirm(
        `Remove "${item.name}" from the menu?`
      )
    ) {
      return
    }

    try {
      setError('')
      setUpdatingId(id)

      await deleteMenuItem(id)
      await refetch()
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          'Could not remove this dish.'
      )
    } finally {
      setUpdatingId(null)
    }
  }

  async function handleAvailabilityToggle(item) {
    const id = item._id || item.id

    try {
      setError('')
      setUpdatingId(id)

      await updateMenuItem(id, {
        isAvailable: !item.isAvailable,
      })

      await refetch()
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          'Could not update availability.'
      )
    } finally {
      setUpdatingId(null)
    }
  }

  const hasFilters =
    search.trim() !== '' || category !== ''

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-tomato">
          Admin
        </p>

        <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-900">
          Menu Management
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Add, edit and control your menu items.
        </p>
      </div>

      {/* Errors */}
      {(error || fetchError) && (
        <ErrorBanner
          message={
            error ||
            fetchError ||
            'Could not load menu.'
          }
        />
      )}

      {/* Search & Filters */}
      <div className="card p-5">
        <div className="grid gap-4 md:grid-cols-[1fr_220px_auto]">
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
              placeholder="Search dishes..."
              className="input-field w-full pl-11"
            />
          </div>

          <select
            value={category}
            onChange={(e) =>
              setCategory(e.target.value)
            }
            className="input-field"
          >
            <option value="">
              All categories
            </option>

            {CATEGORIES.map((item) => (
              <option
                key={item}
                value={item}
              >
                {item}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={clearFilters}
            disabled={!hasFilters}
            className="btn-ghost inline-flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <FiX />
            Clear
          </button>
        </div>

        <div className="mt-4 flex items-center justify-between text-sm">
          <p className="text-slate-500">
            {loading
              ? 'Loading...'
              : `${items.length} item${
                  items.length !== 1
                    ? 's'
                    : ''
                } found`}
          </p>

          {hasFilters && (
            <p className="text-slate-400">
              Filters applied
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Add / Edit Form */}
        <form
          onSubmit={handleSubmit}
          className="card flex h-fit flex-col gap-5 p-6 lg:col-span-1"
        >
          <div>
            <h2 className="font-display text-xl font-semibold">
              {editingId
                ? 'Edit dish'
                : 'Add a dish'}
            </h2>

            <p className="mt-1 text-sm text-char/50">
              {editingId
                ? 'Update this menu item.'
                : 'Create a new menu item.'}
            </p>
          </div>

          <FormField
            label="Name"
            htmlFor="name"
          >
            <input
              id="name"
              name="name"
              required
              className="input-field"
              value={form.name}
              onChange={handleChange}
              placeholder="Margherita"
            />
          </FormField>

          <FormField
            label="Description"
            htmlFor="description"
          >
            <textarea
              id="description"
              name="description"
              rows={4}
              className="input-field resize-none"
              value={form.description}
              onChange={handleChange}
              placeholder="Fresh tomatoes, mozzarella and basil..."
            />
          </FormField>

          <FormField
            label="Base price"
            htmlFor="basePrice"
          >
            <input
              id="basePrice"
              name="basePrice"
              type="number"
              step="0.01"
              min="0"
              required
              className="input-field"
              value={form.basePrice}
              onChange={handleChange}
              placeholder="299"
            />
          </FormField>

          <FormField
            label="Category"
            htmlFor="category"
          >
            <select
              id="category"
              name="category"
              className="input-field"
              value={form.category}
              onChange={handleChange}
            >
              {CATEGORIES.map((item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>
              ))}
            </select>
          </FormField>

          {/* Image URL */}
          <FormField
            label="Image URL"
            htmlFor="image"
          >
            <input
              id="image"
              name="image"
              type="url"
              className="input-field"
              value={form.image}
              onChange={handleChange}
              placeholder="https://example.com/pizza.jpg"
            />
          </FormField>

          {/* Image Preview */}
          {form.image && (
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
              <img
                src={form.image}
                alt="Dish preview"
                className="h-40 w-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display =
                    'none'
                }}
              />
            </div>
          )}

          {/* Tags */}
          <FormField
            label="Tags"
            htmlFor="tags"
          >
            <input
              id="tags"
              name="tags"
              className="input-field"
              value={form.tags}
              onChange={handleChange}
              placeholder="spicy, bestseller, vegetarian"
            />

            <p className="mt-1.5 text-xs text-char/40">
              Separate multiple tags with commas.
            </p>
          </FormField>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary flex-1"
            >
              {submitting
                ? 'Saving...'
                : editingId
                  ? 'Save changes'
                  : 'Add dish'}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="btn-ghost"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {/* Menu List */}
        <div className="lg:col-span-2">
          {loading ? (
            <Loader label="Loading menu..." />
          ) : items.length === 0 ? (
            <div className="card p-10 text-center">
              <FiSearch
                className="mx-auto text-slate-300"
                size={36}
              />

              <p className="mt-4 font-semibold text-slate-700">
                No menu items found.
              </p>

              <p className="mt-1 text-sm text-slate-400">
                Try a different search or category.
              </p>

              {hasFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="btn-secondary mt-5"
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => {
                const id =
                  item._id || item.id

                const isUpdating =
                  updatingId === id

                return (
                  <div
                    key={id}
                    className={`card overflow-hidden transition ${
                      item.isAvailable
                        ? ''
                        : 'opacity-75'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row">
                      {/* Image */}
                      <div className="relative h-48 w-full shrink-0 bg-slate-100 sm:h-auto sm:w-40">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display =
                                'none'
                            }}
                          />
                        ) : (
                          <div className="flex h-full min-h-32 items-center justify-center text-slate-300">
                            <FiImage size={32} />
                          </div>
                        )}

                        <span
                          className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-semibold backdrop-blur ${
                            item.isAvailable
                              ? 'bg-white/90 text-emerald-700'
                              : 'bg-slate-900/80 text-white'
                          }`}
                        >
                          {item.isAvailable
                            ? 'Available'
                            : 'Unavailable'}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="flex min-w-0 flex-1 flex-col justify-between gap-4 p-5">
                        <div>
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div className="min-w-0">
                              <h3 className="font-display text-lg font-semibold text-char">
                                {item.name}
                              </h3>

                              <p className="mt-1 text-sm text-char/50">
                                {item.category}
                                {' · '}
                                {formatCurrency(
                                  item.basePrice
                                )}
                              </p>
                            </div>
                          </div>

                          {item.description && (
                            <p className="mt-3 line-clamp-2 text-sm leading-6 text-char/60">
                              {item.description}
                            </p>
                          )}

                          {/* Tags */}
                          {Array.isArray(
                            item.tags
                          ) &&
                            item.tags.length > 0 && (
                              <div className="mt-3 flex flex-wrap gap-1.5">
                                {item.tags.map(
                                  (tag) => (
                                    <span
                                      key={tag}
                                      className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600"
                                    >
                                      #{tag}
                                    </span>
                                  )
                                )}
                              </div>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              handleAvailabilityToggle(
                                item
                              )
                            }
                            disabled={isUpdating}
                            className="btn-ghost !px-3 !py-1.5 text-sm"
                          >
                            {item.isAvailable
                              ? 'Disable'
                              : 'Enable'}
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              startEdit(item)
                            }
                            disabled={isUpdating}
                            className="btn-ghost !px-3 !py-1.5 text-sm"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(item)
                            }
                            disabled={isUpdating}
                            className="btn-ghost !px-3 !py-1.5 text-sm text-tomato"
                          >
                            {isUpdating
                              ? 'Working...'
                              : 'Delete'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}