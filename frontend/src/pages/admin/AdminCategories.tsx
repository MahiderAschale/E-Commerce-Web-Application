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
      <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
    
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
    
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Categories
              </h1>
    
              <p className="text-gray-500 mt-1">
                Manage your store categories
              </p>
            </div>
    
            <button
              onClick={openCreateForm}
              className="bg-black text-white px-5 py-3 rounded-lg
                         hover:bg-gray-800 transition
                         w-full sm:w-auto"
            >
              + Add Category
            </button>
    
          </div>
    
          {/* Create / Edit Form */}
          {showForm && (
            <div className="bg-white rounded-2xl shadow-sm border mb-8">
    
              {/* Form Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b">
    
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {editingId ? "Edit Category" : "Add New Category"}
                  </h2>
    
                  <p className="text-sm text-gray-500 mt-1">
                    {editingId
                      ? "Update the category information below."
                      : "Create a new category for your products."}
                  </p>
                </div>
    
                <button
                  type="button"
                  onClick={closeForm}
                  className="w-9 h-9 rounded-lg
                             flex items-center justify-center
                             text-gray-500
                             hover:bg-gray-100
                             hover:text-gray-900
                             transition"
                >
                  ✕
                </button>
    
              </div>
    
              {/* Form Body */}
              <form
                onSubmit={handleSubmit}
                className="p-6 space-y-6"
              >
    
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category Name
                  </label>
    
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="e.g. Electronics"
                    required
                    className="w-full border border-gray-300 rounded-lg
                               px-4 py-3
                               focus:outline-none
                               focus:ring-2 focus:ring-black
                               focus:border-transparent"
                  />
                </div>
    
                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
    
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Describe this category..."
                    rows={4}
                    className="w-full border border-gray-300 rounded-lg
                               px-4 py-3
                               resize-none
                               focus:outline-none
                               focus:ring-2 focus:ring-black
                               focus:border-transparent"
                  />
                </div>
    
                {/* Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image URL
                  </label>
    
                  <input
                    type="url"
                    name="image"
                    value={form.image}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                    className="w-full border border-gray-300 rounded-lg
                               px-4 py-3
                               focus:outline-none
                               focus:ring-2 focus:ring-black
                               focus:border-transparent"
                  />
    
                  {/* Image Preview */}
                  {form.image && (
                    <div className="mt-4">
                      <p className="text-xs text-gray-500 mb-2">
                        Preview
                      </p>
    
                      <img
                        src={form.image}
                        alt="Category preview"
                        className="w-24 h-24 rounded-lg object-cover border"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    </div>
                  )}
                </div>
    
                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
    
                  <button
                    type="submit"
                    disabled={saving}
                    className="bg-black text-white px-6 py-3 rounded-lg
                               hover:bg-gray-800
                               disabled:opacity-50
                               disabled:cursor-not-allowed
                               transition"
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
                    className="border border-gray-300 px-6 py-3 rounded-lg
                               hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
    
                </div>
    
              </form>
            </div>
          )}
    
          {/* Categories Card */}
          <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
    
            {/* Card Header */}
            <div className="px-6 py-5 border-b">
    
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
    
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    All Categories
                  </h2>
    
                  <p className="text-sm text-gray-500 mt-1">
                    Manage all product categories
                  </p>
                </div>
    
                <span className="text-sm text-gray-500">
                  {categories.length}{" "}
                  {categories.length === 1
                    ? "category"
                    : "categories"}
                </span>
    
              </div>
    
            </div>
    
            {/* Empty State */}
            {categories.length === 0 ? (
              <div className="py-20 text-center">
    
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                  <span className="text-2xl">📂</span>
                </div>
    
                <h3 className="text-lg font-semibold text-gray-900">
                  No categories yet
                </h3>
    
                <p className="text-gray-500 mt-1 mb-6">
                  Create your first category to organize your products.
                </p>
    
                <button
                  onClick={openCreateForm}
                  className="bg-black text-white px-5 py-3 rounded-lg
                             hover:bg-gray-800 transition"
                >
                  + Add Category
                </button>
    
              </div>
            ) : (
    
              /* Desktop Table */
              <div className="overflow-x-auto">
    
                <table className="w-full">
    
                  <thead className="bg-gray-50 border-b">
    
                    <tr>
    
                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                        Category
                      </th>
    
                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                        Slug
                      </th>
    
                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                        Description
                      </th>
    
                      <th className="text-right px-6 py-4 text-sm font-semibold text-gray-700">
                        Actions
                      </th>
    
                    </tr>
    
                  </thead>
    
                  <tbody>
    
                    {categories.map((category) => (
    
                      <tr
                        key={category.id}
                        className="border-b last:border-b-0
                                   hover:bg-gray-50
                                   transition"
                      >
    
                        {/* Category */}
                        <td className="px-6 py-4">
    
                          <div className="flex items-center gap-4">
    
                            {category.image ? (
    
                              <img
                                src={category.image}
                                alt={category.name}
                                className="w-12 h-12 rounded-xl
                                           object-cover border
                                           flex-shrink-0"
                                onError={(e) => {
                                  e.currentTarget.style.display =
                                    "none";
                                }}
                              />
    
                            ) : (
    
                              <div
                                className="w-12 h-12 rounded-xl
                                           bg-gray-100
                                           flex items-center
                                           justify-center
                                           text-gray-400
                                           flex-shrink-0"
                              >
                                📁
                              </div>
    
                            )}
    
                            <div className="min-w-0">
    
                              <p className="font-semibold text-gray-900">
                                {category.name}
                              </p>
    
                              <p className="text-xs text-gray-400 mt-1">
                                ID: {category.id}
                              </p>
    
                            </div>
    
                          </div>
    
                        </td>
    
                        {/* Slug */}
                        <td className="px-6 py-4">
    
                          <span
                            className="inline-block
                                       bg-gray-100
                                       text-gray-700
                                       px-3 py-1
                                       rounded-lg
                                       text-sm"
                          >
                            {category.slug}
                          </span>
    
                        </td>
    
                        {/* Description */}
                        <td className="px-6 py-4">
    
                          <p className="text-gray-600 max-w-md truncate">
                            {category.description || "No description"}
                          </p>
    
                        </td>
    
                        {/* Actions */}
                        <td className="px-6 py-4">
    
                          <div className="flex justify-end gap-2">
    
                            <button
                              onClick={() =>
                                openEditForm(category)
                              }
                              className="px-4 py-2
                                         border border-gray-300
                                         rounded-lg
                                         hover:bg-gray-100
                                         transition"
                            >
                              Edit
                            </button>
    
                            <button
                              onClick={() =>
                                handleDelete(category.id)
                              }
                              className="px-4 py-2
                                         bg-red-600
                                         text-white
                                         rounded-lg
                                         hover:bg-red-700
                                         transition"
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
    );}
  }