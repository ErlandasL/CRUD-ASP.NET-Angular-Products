using ProductCatalogueApi.Interfaces;
using ProductCatalogueApi.Models;
using System;
using System.Collections.Generic;
using ProductCatalogueApi.Data; // Update the namespace
using System.Linq;

namespace ProductCatalogueApi.Services
{
    public class ProductService : IProductService
    {
        private readonly AppDbContext _dbContext;

        public ProductService(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public IEnumerable<Product> GetProducts()
        {
            return _dbContext.Products.ToList(); // Update to retrieve products from the database
        }

        public Product GetProductById(int id)
        {
            return _dbContext.Products.FirstOrDefault(p => p.Id == id); // Update to retrieve product from the database
        }

        public Product CreateProduct(Product product)
        {
            if (product == null)
                throw new ArgumentNullException(nameof(product));

            product.Id = GenerateProductId();
            _dbContext.Products.Add(product); // Update to add the product to the database
            _dbContext.SaveChanges(); // Save changes to the database
            return product;
        }

        public Product UpdateProduct(Product product)
        {
            if (product == null)
                throw new ArgumentNullException(nameof(product));

            var existingProduct = _dbContext.Products.FirstOrDefault(p => p.Id == product.Id);
            if (existingProduct == null)
                return null;

            existingProduct.Name = product.Name;
            existingProduct.Description = product.Description;
            existingProduct.ProductTypeId = product.ProductTypeId;

            _dbContext.SaveChanges(); // Save changes to the database

            return existingProduct;
        }

        public Product DeleteProduct(int id)
        {
            var product = _dbContext.Products.FirstOrDefault(p => p.Id == id);
            if (product != null)
            {
                _dbContext.Products.Remove(product);
                _dbContext.SaveChanges(); // Save changes to the database
            }

            return product;
        }

        public IEnumerable<ProductType> GetProductTypes()
        {
            return _dbContext.ProductTypes.ToList(); // Update to retrieve product types from the database
        }

        public ProductType GetProductTypeById(int id)
        {
            return _dbContext.ProductTypes.FirstOrDefault(pt => pt.Id == id); // Update to retrieve product type from the database
        }

        private int GenerateProductId()
        {
            return _dbContext.Products.Count() > 0 ? _dbContext.Products.Max(p => p.Id) + 1 : 1; // Update to use the database count and maximum id
        }
    }
}
