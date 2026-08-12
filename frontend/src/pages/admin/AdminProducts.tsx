import { useEffect, useState } from "react";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../../services/product.service";
import { getCategories } from "../../services/category.service";

interface Product {
  id: string;
  name: string;
  description?: string;
  price: string;
  stock: number;
  sku: string;
  status: "ACTIVE" | "INACTIVE";
  featured: boolean;
  category?: {
    id: string;
    name: string;
  };
}

interface Category {
  id: string;
  name: string;
}

interface ProductForm {
  name: string;
  description: string;
  price: string;
  stock: string;
  sku: string;
  categoryId: string;
  status: "ACTIVE" | "INACTIVE";
  featured: boolean;
}

const emptyForm: ProductForm = {
  name: "",
  description: "",
  price: "",
  stock: "",
  sku: "",
  categoryId: "",
  status: "ACTIVE",
  featured: false,
};

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingProductId, setEditingProductId] =
    useState<string | null>(null);

  const [form, setForm] = useState<ProductForm>(emptyForm);

  // ==========================================
  // LOAD PRODUCTS
  // ==========================================

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getProducts({
        page: 1,
        limit: 20,
      });

      setProducts(response.data.products);
    } catch (err: any) {
      console.error("Failed to load products:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load products."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOAD CATEGORIES
  // ==========================================

  const loadCategories = async () => {
    try {
      const response = await getCategories();

      setCategories(response.data);
    } catch (err: any) {
      console.error("Failed to load categories:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load categories."
      );
    }
  };

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  // ==========================================
  // FORM HELPERS
  // ==========================================

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleFeaturedChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm((current) => ({
      ...current,
      featured: e.target.checked,
    }));
  };

  // ==========================================
  // OPEN ADD FORM
  // ==========================================

  const openAddForm = () => {
    setEditingProductId(null);
    setForm(emptyForm);
    setError("");
    setSuccess("");
    setShowForm(true);
  };

  // ==========================================
  // OPEN EDIT FORM
  // ==========================================

  const openEditForm = (product: Product) => {
    setEditingProductId(product.id);

    setForm({
      name: product.name,
      description: product.description || "",
      price: String(product.price),
      stock: String(product.stock),
      sku: product.sku,
      categoryId: product.category?.id || "",
      status: product.status,
      featured: product.featured,
    });

    setError("");
    setSuccess("");
    setShowForm(true);
  };

  // ==========================================
  // CLOSE FORM
  // ==========================================

  const closeForm = () => {
    if (saving) return;

    setShowForm(false);
    setEditingProductId(null);
    setForm(emptyForm);
  };

  // ==========================================
  // CREATE / UPDATE PRODUCT
  // ==========================================

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // Basic validation
    if (
      !form.name ||
      !form.description ||
      !form.price ||
      !form.stock ||
      !form.sku ||
      !form.categoryId
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    const price = Number(form.price);
    const stock = Number(form.stock);

    if (isNaN(price) || price <= 0) {
      setError("Price must be a valid number greater than 0.");
      return;
    }

    if (isNaN(stock) || stock < 0) {
      setError("Stock must be a valid number.");
      return;
    }

    try {
      setSaving(true);

      const productData = {
        name: form.name.trim(),
        description: form.description.trim(),
        price,
        stock,
        sku: form.sku.trim(),
        categoryId: form.categoryId,
        status: form.status,
        featured: form.featured,
      };

      if (editingProductId) {
        // UPDATE
        await updateProduct(
          editingProductId,
          productData
        );

        setSuccess(
          "Product updated successfully."
        );
      } else {
        // CREATE
        await createProduct(productData);

        setSuccess(
          "Product created successfully."
        );
      }

      await loadProducts();

      setShowForm(false);
      setEditingProductId(null);
      setForm(emptyForm);
    } catch (err: any) {
      console.error(
        "Failed to save product:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to save product."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // DELETE PRODUCT
  // ==========================================

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) return;

    try {
      setError("");
      setSuccess("");

      await deleteProduct(id);

      setProducts((current) =>
        current.filter(
          (product) => product.id !== id
        )
      );

      setSuccess(
        "Product deleted successfully."
      );
    } catch (err: any) {
      console.error(
        "Failed to delete product:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to delete product."
      );
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="p-8">
        <p>Loading products...</p>
      </div>
    );
  }

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="p-6">
      {/* =====================================
          HEADER
      ====================================== */}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">
            Products
          </h1>

          <p className="text-gray-500 mt-1">
            Manage your store products
          </p>
        </div>

        <button
          className="bg-black text-white px-5 py-3 rounded-lg hover:bg-gray-800"
          onClick={openAddForm}
        >
          + Add Product
        </button>
      </div>

      {/* =====================================
          SUCCESS MESSAGE
      ====================================== */}

      {success && (
        <div className="mb-6 rounded-lg bg-green-100 text-green-700 px-4 py-3">
          {success}
        </div>
      )}

      {/* =====================================
          ERROR MESSAGE
      ====================================== */}

      {error && (
        <div className="mb-6 rounded-lg bg-red-100 text-red-700 px-4 py-3">
          {error}
        </div>
      )}

      {/* =====================================
          ADD / EDIT FORM
      ====================================== */}

      {showForm && (
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">
                {editingProductId
                  ? "Edit Product"
                  : "Add Product"}
              </h2>

              <p className="text-gray-500 mt-1">
                {editingProductId
                  ? "Update product information"
                  : "Create a new product"}
              </p>
            </div>

            <button
              type="button"
              onClick={closeForm}
              className="text-gray-500 hover:text-black text-xl"
              disabled={saving}
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
              <label className="block font-medium mb-2">
                Product Name
              </label>

              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="MacBook Pro M4"
                className="w-full border rounded-lg px-4 py-3"
              />
            </div>

            {/* Description */}

            <div>
              <label className="block font-medium mb-2">
                Description
              </label>

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                placeholder="Product description..."
                className="w-full border rounded-lg px-4 py-3"
              />
            </div>

            {/* Price + Stock */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block font-medium mb-2">
                  Price (ETB)
                </label>

                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  placeholder="2499.99"
                  className="w-full border rounded-lg px-4 py-3"
                />
              </div>

              <div>
                <label className="block font-medium mb-2">
                  Stock
                </label>

                <input
                  type="number"
                  name="stock"
                  value={form.stock}
                  onChange={handleChange}
                  min="0"
                  placeholder="10"
                  className="w-full border rounded-lg px-4 py-3"
                />
              </div>
            </div>

            {/* SKU */}

            <div>
              <label className="block font-medium mb-2">
                SKU
              </label>

              <input
                type="text"
                name="sku"
                value={form.sku}
                onChange={handleChange}
                placeholder="MBP-M4-001"
                className="w-full border rounded-lg px-4 py-3"
              />
            </div>

            {/* Category */}

            <div>
              <label className="block font-medium mb-2">
                Category
              </label>

              <select
                name="categoryId"
                value={form.categoryId}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-3 bg-white"
              >
                <option value="">
                  Select category
                </option>

                {categories.map((category) => (
                  <option
                    key={category.id}
                    value={category.id}
                  >
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Status */}

            <div>
              <label className="block font-medium mb-2">
                Status
              </label>

              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-3 bg-white"
              >
                <option value="ACTIVE">
                  ACTIVE
                </option>

                <option value="INACTIVE">
                  INACTIVE
                </option>
              </select>
            </div>

            {/* Featured */}

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="featured"
                checked={form.featured}
                onChange={handleFeaturedChange}
                className="w-4 h-4"
              />

              <label
                htmlFor="featured"
                className="font-medium"
              >
                Featured Product
              </label>
            </div>

            {/* Buttons */}

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={saving}
                className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 disabled:opacity-50"
              >
                {saving
                  ? "Saving..."
                  : editingProductId
                  ? "Update Product"
                  : "Create Product"}
              </button>

              <button
                type="button"
                onClick={closeForm}
                disabled={saving}
                className="border px-6 py-3 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* =====================================
          PRODUCT TABLE
      ====================================== */}

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-6 py-4">
                  Product
                </th>

                <th className="text-left px-6 py-4">
                  Category
                </th>

                <th className="text-left px-6 py-4">
                  Price
                </th>

                <th className="text-left px-6 py-4">
                  Stock
                </th>

                <th className="text-left px-6 py-4">
                  Status
                </th>

                <th className="text-right px-6 py-4">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-10 text-gray-500"
                  >
                    No products found.
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b last:border-b-0"
                  >
                    {/* Product */}

                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold">
                          {product.name}
                        </p>

                        <p className="text-sm text-gray-500">
                          SKU: {product.sku}
                        </p>

                        {product.featured && (
                          <span className="text-xs text-yellow-600">
                            ★ Featured
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Category */}

                    <td className="px-6 py-4">
                      {product.category?.name || "—"}
                    </td>

                    {/* Price */}

                    <td className="px-6 py-4 font-medium">
                      {Number(
                        product.price
                      ).toFixed(2)}{" "}
                      ETB
                    </td>

                    {/* Stock */}

                    <td className="px-6 py-4">
                      {product.stock}
                    </td>

                    {/* Status */}

                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          product.status === "ACTIVE"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {product.status}
                      </span>
                    </td>

                    {/* Actions */}

                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          className="px-3 py-2 border rounded-lg hover:bg-gray-50"
                          onClick={() =>
                            openEditForm(product)
                          }
                        >
                          Edit
                        </button>

                        <button
                          className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                          onClick={() =>
                            handleDelete(
                              product.id
                            )
                          }
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}