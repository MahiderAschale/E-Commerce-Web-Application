import { useEffect, useState } from "react";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImages,
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
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
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
  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!e.target.files) return;
  
    const files = Array.from(e.target.files);
  
    setSelectedImages(files);
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
    setSelectedImages([]);
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
    setSelectedImages([]);
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
        // ==========================================
        // UPDATE PRODUCT
        // ==========================================
      
        await updateProduct(
          editingProductId,
          productData
        );
      
        // Upload new images if selected
        if (selectedImages.length > 0) {
          await uploadProductImages(
            editingProductId,
            selectedImages
          );
        }
      
        setSuccess(
          "Product updated successfully."
        );
      } else {
        // ==========================================
        // CREATE PRODUCT
        // ==========================================
      
        const response = await createProduct(productData);
      
        const createdProduct = response.data;
      
        // Upload images after product is created
        if (selectedImages.length > 0) {
          await uploadProductImages(
            createdProduct.id,
            selectedImages
          );
        }
      
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
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
  
        {/* ================================
            HEADER
        ================================= */}
  
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
  
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Products
            </h1>
  
            <p className="text-gray-500 mt-1">
              Manage your store products
            </p>
          </div>
  
          <button
            onClick={openAddForm}
            className="w-full sm:w-auto bg-black text-white px-5 py-3 rounded-lg font-medium hover:bg-gray-800 transition"
          >
            + Add Product
          </button>
  
        </div>
  
  
        {/* ================================
            SUCCESS MESSAGE
        ================================= */}
  
        {success && (
          <div className="mb-6 rounded-lg bg-green-100 border border-green-200 text-green-700 px-4 py-3">
            {success}
          </div>
        )}
  
  
        {/* ================================
            ERROR MESSAGE
        ================================= */}
  
        {error && (
          <div className="mb-6 rounded-lg bg-red-100 border border-red-200 text-red-700 px-4 py-3">
            {error}
          </div>
        )}
  
  
        {/* ================================
            PRODUCT SUMMARY
        ================================= */}
  
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
  
          <div className="bg-white rounded-xl shadow-sm p-5">
            <p className="text-sm text-gray-500">
              Total Products
            </p>
  
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {products.length}
            </p>
          </div>
  
  
          <div className="bg-white rounded-xl shadow-sm p-5">
            <p className="text-sm text-gray-500">
              Active Products
            </p>
  
            <p className="text-3xl font-bold text-green-600 mt-2">
              {
                products.filter(
                  (product) => product.status === "ACTIVE"
                ).length
              }
            </p>
          </div>
  
  
          <div className="bg-white rounded-xl shadow-sm p-5">
            <p className="text-sm text-gray-500">
              Featured Products
            </p>
  
            <p className="text-3xl font-bold text-yellow-600 mt-2">
              {
                products.filter(
                  (product) => product.featured
                ).length
              }
            </p>
          </div>
  
        </div>
  
  
        {/* ================================
            ADD / EDIT FORM
        ================================= */}
  
        {showForm && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-7 mb-8">
  
            <div className="flex items-center justify-between mb-6">
  
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
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
                disabled={saving}
                className="w-9 h-9 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition"
              >
                ✕
              </button>
  
            </div>
  
  
            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >
  
              {/* Product Name */}
  
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name
                </label>
  
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="MacBook Pro M4"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-black focus:border-transparent"
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
                  rows={4}
                  placeholder="Product description..."
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-none"
                />
              </div>
  
  
              {/* Price / Stock */}
  
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
  
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
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
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>
  
  
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stock
                  </label>
  
                  <input
                    type="number"
                    name="stock"
                    value={form.stock}
                    onChange={handleChange}
                    min="0"
                    placeholder="10"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>
  
              </div>
  
  
              {/* SKU */}
  
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SKU
                </label>
  
                <input
                  type="text"
                  name="sku"
                  value={form.sku}
                  onChange={handleChange}
                  placeholder="MBP-M4-001"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
  
  
              {/* Category */}
  
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
  
                <select
                  name="categoryId"
                  value={form.categoryId}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-black focus:border-transparent"
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
  
            {/* Product Images */}

<div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Product Images
  </label>

  <input
    type="file"
    accept="image/*"
    multiple
    onChange={handleImageChange}
    className="w-full border border-gray-300 rounded-lg px-4 py-3
               bg-white
               file:mr-4
               file:py-2
               file:px-4
               file:rounded-lg
               file:border-0
               file:bg-black
               file:text-white
               file:cursor-pointer"
  />

  <p className="text-xs text-gray-500 mt-2">
    You can select one or multiple product images.
  </p>

  {/* Selected images preview */}

  {selectedImages.length > 0 && (
    <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
      {selectedImages.map((file, index) => (
        <div
          key={`${file.name}-${index}`}
          className="relative"
        >
          <img
            src={URL.createObjectURL(file)}
            alt={`Product preview ${index + 1}`}
            className="w-full h-32 object-cover rounded-lg border"
          />

          <button
            type="button"
            onClick={() => {
              setSelectedImages((current) =>
                current.filter((_, i) => i !== index)
              );
            }}
            className="absolute top-2 right-2 w-7 h-7 rounded-full
                       bg-red-600 text-white
                       hover:bg-red-700
                       flex items-center justify-center"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  )}
</div>
  
              {/* Status */}
  
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
  
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-black focus:border-transparent"
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
                  className="w-4 h-4 accent-black"
                />
  
                <label
                  htmlFor="featured"
                  className="text-sm font-medium text-gray-700"
                >
                  Featured Product
                </label>
  
              </div>
  
  
              {/* Buttons */}
  
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
  
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition disabled:opacity-50"
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
                  className="border border-gray-300 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
  
              </div>
  
            </form>
  
          </div>
        )}
  
  
        {/* ================================
            PRODUCT TABLE
        ================================= */}
  
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
  
          <div className="px-5 sm:px-6 py-5 border-b">
  
            <h2 className="text-xl font-bold text-gray-900">
              All Products
            </h2>
  
            <p className="text-sm text-gray-500 mt-1">
              View and manage your store inventory
            </p>
  
          </div>
  
  
          <div className="overflow-x-auto">
  
            <table className="w-full">
  
              <thead className="bg-gray-50 border-b">
  
                <tr>
  
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                    Product
                  </th>
  
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                    Category
                  </th>
  
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                    Price
                  </th>
  
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                    Stock
                  </th>
  
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                    Status
                  </th>
  
                  <th className="text-right px-6 py-4 text-sm font-semibold text-gray-600">
                    Actions
                  </th>
  
                </tr>
  
              </thead>
  
  
              <tbody>
  
                {products.length === 0 ? (
  
                  <tr>
  
                    <td
                      colSpan={6}
                      className="text-center py-16 text-gray-500"
                    >
                      No products found.
                    </td>
  
                  </tr>
  
                ) : (
  
                  products.map((product) => (
  
                    <tr
                      key={product.id}
                      className="border-b last:border-b-0 hover:bg-gray-50 transition"
                    >
  
                      {/* Product */}
  
                      <td className="px-6 py-5">
  
                        <div>
  
                          <p className="font-semibold text-gray-900">
                            {product.name}
                          </p>
  
                          <p className="text-sm text-gray-500 mt-1">
                            SKU: {product.sku}
                          </p>
  
                          {product.featured && (
                            <span className="inline-block mt-1 text-xs font-medium text-yellow-600">
                              ★ Featured
                            </span>
                          )}
  
                        </div>
  
                      </td>
  
  
                      {/* Category */}
  
                      <td className="px-6 py-5 text-gray-600">
                        {product.category?.name || "—"}
                      </td>
  
  
                      {/* Price */}
  
                      <td className="px-6 py-5 font-semibold text-gray-900">
                        {Number(product.price).toFixed(2)} ETB
                      </td>
  
  
                      {/* Stock */}
  
                      <td className="px-6 py-5">
  
                        <span
                          className={`font-medium ${
                            product.stock === 0
                              ? "text-red-600"
                              : product.stock < 5
                              ? "text-yellow-600"
                              : "text-gray-900"
                          }`}
                        >
                          {product.stock}
                        </span>
  
                      </td>
  
  
                      {/* Status */}
  
                      <td className="px-6 py-5">
  
                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                            product.status === "ACTIVE"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {product.status}
                        </span>
  
                      </td>
  
  
                      {/* Actions */}
  
                      <td className="px-6 py-5">
  
                        <div className="flex justify-end gap-2">
  
                          <button
                            onClick={() =>
                              openEditForm(product)
                            }
                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-100 transition"
                          >
                            Edit
                          </button>
  
  
                          <button
                            onClick={() =>
                              handleDelete(product.id)
                            }
                            className="px-3 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition"
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
    </div>
  );}