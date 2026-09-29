import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getProducts,
  deleteProduct,
} from "../services/productService";
import { getCategories } from "../services/categoryService";
import { getBrands } from "../services/brandService";
import "../styles/Products.css";

function Products() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [brandFilter, setBrandFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const productsPerPage = 10;

  const navigate = useNavigate();

  // Fetch products
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error("Error loading products:", error);
        setError(
          "Failed to fetch products. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Fetch brands
  useEffect(() => {
    const loadBrands = async () => {
      try {
        const data = await getBrands();
        setBrands(data);
      } catch (error) {
        console.error("Error loading brands:", error);
        setError(
          "Failed to fetch brands. Please try again later."
        );
      }
    };

    loadBrands();
  }, []);

  // Fetch categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error("Error loading categories:", error);
        setError(
          "Failed to fetch categories. Please try again later."
        );
      }
    };

    loadCategories();
  }, []);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, categoryFilter, brandFilter]);

  // Filter products
  const filteredProducts = products.filter((product) => {
    const name = product.name.toLowerCase();
    const sku = product.sku.toLowerCase();
    const search = searchQuery.toLowerCase();

    const matchesSearch =
      name.includes(search) ||
      sku.includes(search);

    const matchesCategory =
      categoryFilter === "" ||
      product.category === categoryFilter;

    const matchesBrand =
      brandFilter === "" ||
      product.brand === brandFilter;

    return (
      matchesSearch &&
      matchesCategory &&
      matchesBrand
    );
  });

  // Pagination
  const indexOfLastProduct =
    currentPage * productsPerPage;

  const indexOfFirstProduct =
    indexOfLastProduct - productsPerPage;

  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const totalPages = Math.ceil(
    filteredProducts.length / productsPerPage
  );

  // Keep current page valid
  useEffect(() => {
    if (totalPages === 0) {
      setCurrentPage(1);
      return;
    }

    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }

    if (currentPage < 1) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  // Delete product
  const deleteAProduct = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) {
      return;
    }

    setDeleteError(null);

    try {
      setDeletingId(id);

      await deleteProduct(id);

      setProducts((currentProducts) =>
        currentProducts.filter(
          (product) => product.id !== id
        )
      );
    } catch (error) {
      console.error(
        "Error deleting product:",
        error
      );

      setDeleteError(
        "Failed to delete product. Please try again later."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // Search products
  const handleSearch = (e) => {
    e.preventDefault();

    setDeleteError(null);
    setSearchQuery(searchTerm);
  };

  // Clear filters
  const clearSearch = () => {
    setSearchTerm("");
    setSearchQuery("");
    setCategoryFilter("");
    setBrandFilter("");
    setCurrentPage(1);
    setDeleteError(null);
  };

  // Loading
  if (loading) {
    return (
      <div className="products-page">
        <div className="products-loading">
          Loading products...
        </div>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="products-page">
        <div className="products-error">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="products-page">

      {/* Page header */}

      <div className="products-header">

        <div>
          <p className="products-label">
            INVENTORY MANAGEMENT
          </p>

          <h1>Products</h1>

          <p className="products-description">
            Manage your StockPilot inventory.
          </p>
        </div>

        <div className="products-header-actions">

          {/* Home button */}

          <button
            className="home-button"
            onClick={() => navigate("/")}
          >
            ← Home
          </button>

          {/* Add product button */}

          <button
            className="add-product-button"
            onClick={() =>
              navigate("/products/add")
            }
          >
            + Add Product
          </button>

        </div>

      </div>

      {/* Delete error */}

      {deleteError && (
        <div className="delete-error">
          {deleteError}
        </div>
      )}

      {/* Filters */}

      <div className="products-controls">

        <form
          className="product-search"
          onSubmit={handleSearch}
        >
          <input
            placeholder="Search by product name or SKU..."
            type="text"
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(e.target.value)
            }
          />

          <button type="submit">
            Search
          </button>
        </form>

        {/* Category filter */}

        <select
          value={categoryFilter}
          onChange={(e) =>
            setCategoryFilter(e.target.value)
          }
        >
          <option value="">
            All Categories
          </option>

          {categories.map((category) => (
            <option
              key={category.id}
              value={category.name}
            >
              {category.name}
            </option>
          ))}
        </select>

        {/* Brand filter */}

        <select
          value={brandFilter}
          onChange={(e) =>
            setBrandFilter(e.target.value)
          }
        >
          <option value="">
            All Brands
          </option>

          {brands.map((brand) => (
            <option
              key={brand.id}
              value={brand.name}
            >
              {brand.name}
            </option>
          ))}
        </select>

        {/* Clear filters */}

        <button
          className="clear-button"
          onClick={clearSearch}
        >
          Clear
        </button>

      </div>

      {/* Results information */}

      <div className="products-results">

        <span>
          Showing{" "}
          <strong>
            {filteredProducts.length}
          </strong>{" "}
          products
        </span>

        {(searchQuery ||
          categoryFilter ||
          brandFilter) && (
          <span className="filter-active">
            Filters active
          </span>
        )}

      </div>

      {/* Product table */}

      <div className="products-table-container">

        <table className="products-table">

          <thead>
            <tr>
              <th>SKU</th>
              <th>Product</th>
              <th>Brand</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>

            {currentProducts.map((product) => (

              <tr key={product.id}>

                <td>
                  <span className="sku">
                    {product.sku}
                  </span>
                </td>

                <td>
                  <button
                    className="product-name-button"
                    onClick={() =>
                      navigate(
                        `/products/${product.id}`
                      )
                    }
                  >
                    {product.name}
                  </button>
                </td>

                <td>
                  {product.brand}
                </td>

                <td>
                  <span className="category-badge">
                    {product.category}
                  </span>
                </td>

                <td className="price">
                  ${Number(product.price).toFixed(2)}
                </td>

                <td>
                  <span
                    className={
                      product.quantity === 0
                        ? "stock stock-out"
                        : product.quantity <= 5
                        ? "stock stock-low"
                        : "stock stock-good"
                    }
                  >
                    {product.quantity}
                  </span>
                </td>

                <td>
                  <div className="action-buttons">

                    {/* Edit */}

                    <button
                      className="edit-button"
                      onClick={() =>
                        navigate(
                          `/products/edit/${product.id}`
                        )
                      }
                    >
                      Edit
                    </button>

                    {/* Delete */}

                    <button
                      className="delete-button"
                      onClick={() =>
                        deleteAProduct(product.id)
                      }
                      disabled={
                        deletingId !== null
                      }
                    >
                      {deletingId === product.id
                        ? "Deleting..."
                        : "Delete"}
                    </button>

                  </div>
                </td>

              </tr>

            ))}

            {/* No products */}

            {products.length === 0 && (
              <tr>
                <td
                  colSpan="7"
                  className="empty-table"
                >
                  No products available.
                </td>
              </tr>
            )}

            {/* No search results */}

            {products.length > 0 &&
              filteredProducts.length === 0 && (
                <tr>
                  <td
                    colSpan="7"
                    className="empty-table"
                  >
                    No products match your search.
                  </td>
                </tr>
              )}

          </tbody>

        </table>

      </div>

      {/* Pagination */}

      {totalPages > 0 && (
        <div className="pagination">

          <button
            onClick={() =>
              setCurrentPage(
                currentPage - 1
              )
            }
            disabled={currentPage === 1}
          >
            ← Previous
          </button>

          <span>
            Page{" "}
            <strong>
              {currentPage}
            </strong>{" "}
            of{" "}
            <strong>
              {totalPages}
            </strong>
          </span>

          <button
            onClick={() =>
              setCurrentPage(
                currentPage + 1
              )
            }
            disabled={
              currentPage === totalPages
            }
          >
            Next →
          </button>

        </div>
      )}

    </div>
  );
}

export default Products;