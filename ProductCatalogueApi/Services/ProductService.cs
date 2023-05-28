using ProductCatalogueApi.Interfaces;
using ProductCatalogueApi.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace ProductCatalogueApi.Services
{
    public class ProductService : IProductService
    {
        private readonly List<Product> _products;
        private readonly List<ProductType> _productTypes;

        public ProductService()
        {
            _products = new List<Product>();
            _productTypes = new List<ProductType>()
            {
                new ProductType { Id = 1, Name = "Laptop" },
                new ProductType { Id = 2, Name = "Phone" },
                new ProductType { Id = 3, Name = "Tablet" },
                new ProductType { Id = 4, Name = "SmartWatch" }
            };
        }

        public IEnumerable<Product> GetProducts()
        {
            return _products;
        }

        public Product GetProductById(int id)
        {
            return _products.FirstOrDefault(p => p.Id == id);
        }

        public Product CreateProduct(Product product)
        {
            if (product == null)
                throw new ArgumentNullException(nameof(product));

            product.Id = GenerateProductId();
            _products.Add(product);
            return product;
        }

        public Product UpdateProduct(Product product)
        {
            if (product == null)
                throw new ArgumentNullException(nameof(product));

            var existingProduct = _products.FirstOrDefault(p => p.Id == product.Id);
            if (existingProduct == null)
                return null;

            existingProduct.Name = product.Name;
            existingProduct.Description = product.Description;
            existingProduct.ProductTypeId = product.ProductTypeId;

            return existingProduct;
        }

        public Product DeleteProduct(int id)
        {
            var product = _products.FirstOrDefault(p => p.Id == id);
            if (product != null)
                _products.Remove(product);

            return product;
        }

        public IEnumerable<ProductType> GetProductTypes()
        {
            return _productTypes;
        }

        public ProductType GetProductTypeById(int id)
        {
            return _productTypes.FirstOrDefault(pt => pt.Id == id);
        }

        private int GenerateProductId()
        {
            return _products.Count > 0 ? _products.Max(p => p.Id) + 1 : 1;
        }
    }
}
