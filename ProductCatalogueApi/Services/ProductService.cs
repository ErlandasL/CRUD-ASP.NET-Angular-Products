using ProductCatalogueApi.Interfaces;
using ProductCatalogueApi.Models;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using ProductCatalogueApi.Data;
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
            return _dbContext.Products.ToList();
        }

        public Product GetProductById(int id)
        {
            return _dbContext.Products.FirstOrDefault(p => p.Id == id);
        }

        public Product CreateProduct(Product product)
        {
            _dbContext.Products.Add(product);
            _dbContext.SaveChanges();
            return product;
        }

        public Product UpdateProduct(Product product)
        {
            var existingProduct = _dbContext.Products.FirstOrDefault(p => p.Id == product.Id);
            if (existingProduct != null)
            {
                existingProduct.Name = product.Name;
                existingProduct.Description = product.Description;
                _dbContext.SaveChanges();
                return existingProduct;
            }
            return null;
        }

        public Product DeleteProduct(int id)
        {
            var existingProduct = _dbContext.Products.FirstOrDefault(p => p.Id == id);
            if (existingProduct != null)
            {
                _dbContext.Products.Remove(existingProduct);
                _dbContext.SaveChanges();
                return existingProduct;
            }
            return null;
        }
    }
}
