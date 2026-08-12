import { useEffect, useState } from "react";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../services/category.service";

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

interface CategoryForm {
  name: string;
  description: string;
  image: string;
}

const emptyForm: CategoryForm = {
  name: "",
  description: "",
  image: "",
};

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState<CategoryForm>(emptyForm);

  const [saving, setSaving] = useState(false);

  // ==========================================
  // Load Categories
  // ==========================================

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getCategories();

      setCategories(response.data);
    } catch (err: any) {
      console.error("Failed to load categories:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load categories."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  // ==========================================
  // Form Helpers
  // ==========================================

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const openCreateForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEditForm = (category: Category) => {
    setEditingId(category.id);

    setForm({
      name: category.name,
      description: category.description || "",
      image: category.image || "",
    });

    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  // ==========================================
  // Create / Update
  // ==========================================

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!form.name.trim()) {
      alert("Category name is required.");
      return;
    }

    try {
      setSaving(true);

      if (editingId) {
        // Update
        const response = await updateCategory(
          editingId,
          {
            name: form.name,
            description: form.description || undefined,
            image: form.image || undefined,
          }
        );

        setCategories((current) =>
          current.map((category) =>
            category.id === editingId
              ? response.data
              : category
          )
        );

        alert("Category updated successfully.");
      } else {
        // Create
        const response = await createCategory({
          name: form.name,
          description: form.description || undefined,
          image: form.image || undefined,
        });

        setCategories((current) => [
          response.data,
          ...current,
        ]);

        alert("Category created successfully.");
      }

      closeForm();
    } catch (err: any) {
      console.error("Failed to save category:", err);

      alert(
        err.response?.data?.message ||
          "Failed to save category."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // Delete
  // ==========================================

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this category?"
    );

    if (!confirmed) return;

    try {
      await deleteCategory(id);

      setCategories((current) =>
        current.filter((category) => category.id !== id)
      );

      alert("Category deleted successfully.");
    } catch (err: any) {
      console.error("Failed to delete category:", err);

      alert(
        err.response?.data?.message ||
          "Failed to delete category."
      );
    }
  };

  // ==========================================
  // Loading
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-600">
          Loading categories...
        </p>
      </div>
    );
  }

  // ==========================================
  // Error
  // ==========================================

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-red-600">
          {error}
        </p>
      </div>
    );
  }

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">

          <div>
            <h1 className="text-3xl font-bold">
              Categories
            </h1>

            <p className="text-gray-500 mt-1">
              Manage your store categories
            </p>
          </div>

          <button
            onClick={openCreateForm}
            className="bg-black text-white px-5 py-3 rounded-lg hover:bg-gray-800 transition"
          >
            + Add Category
          </button>

        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-xl shadow p-6 mb-8">

            <div className="flex items-center justify-between mb-6">

              <div>
                <h2 className="text-xl font-bold">
                  {editingId
                    ? "Edit Category"
                    : "Add New Category"}
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  {editingId
                    ? "Update category information."
                    : "Create a new product category."}
                </p>
              </div>

              <button
                onClick={closeForm}
                className="text-gray-500 hover:text-black text-xl"
              >
                ✕
              </button>

            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              {/* Name */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Category Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Electronics"
                  className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Description
                </label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Category description..."
                  rows={4}
                  className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              {/* Image */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Image URL
                </label>

                <input
                  type="text"
                  name="image"
                  value={form.image}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">

                <button
                  type="submit"
                  disabled={saving}
                  className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 disabled:opacity-50"
                >
                  {saving
                    ? "Saving..."
                    : editingId
                    ? "Update Category"
                    : "Create Category"}
                </button>

                <button
                  type="button"
                  onClick={closeForm}
                  className="border px-6 py-3 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>

              </div>

            </form>
          </div>
        )}

        {/* Categories */}
        <div className="bg-white rounded-xl shadow overflow-hidden">

          <div className="px-6 py-5 border-b">
            <h2 className="text-xl font-bold">
              All Categories
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              {categories.length} categor
              {categories.length === 1 ? "y" : "ies"}
            </p>
          </div>

          {categories.length === 0 ? (
            <div className="py-16 text-center">

              <p className="text-gray-500 mb-4">
                No categories found.
              </p>

              <button
                onClick={openCreateForm}
                className="bg-black text-white px-5 py-3 rounded-lg"
              >
                + Add Category
              </button>

            </div>
          ) : (
            <div className="overflow-x-auto">

              <table className="w-full">

                <thead className="bg-gray-50 border-b">

                  <tr>

                    <th className="text-left px-6 py-4">
                      Category
                    </th>

                    <th className="text-left px-6 py-4">
                      Slug
                    </th>

                    <th className="text-left px-6 py-4">
                      Description
                    </th>

                    <th className="text-right px-6 py-4">
                      Actions
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {categories.map((category) => (

                    <tr
                      key={category.id}
                      className="border-b last:border-b-0 hover:bg-gray-50"
                    >

                      {/* Category */}
                      <td className="px-6 py-4">

                        <div className="flex items-center gap-4">

                          {category.image ? (
                            <img
                              src={category.image}
                              alt={category.name}
                              className="w-12 h-12 rounded-lg object-cover border"
                              onError={(e) => {
                                e.currentTarget.style.display =
                                  "none";
                              }}
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
                              —
                            </div>
                          )}

                          <div>

                            <p className="font-semibold">
                              {category.name}
                            </p>

                            <p className="text-xs text-gray-400">
                              ID: {category.id}
                            </p>

                          </div>

                        </div>

                      </td>

                      {/* Slug */}
                      <td className="px-6 py-4">

                        <span className="bg-gray-100 px-3 py-1 rounded-lg text-sm">
                          {category.slug}
                        </span>

                      </td>

                      {/* Description */}
                      <td className="px-6 py-4 text-gray-600 max-w-md">

                        {category.description || "—"}

                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">

                        <div className="flex justify-end gap-2">

                          <button
                            onClick={() =>
                              openEditForm(category)
                            }
                            className="px-4 py-2 border rounded-lg hover:bg-gray-100 transition"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() =>
                              handleDelete(category.id)
                            }
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                          >
                            Delete
                          </button>

                        </div>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}