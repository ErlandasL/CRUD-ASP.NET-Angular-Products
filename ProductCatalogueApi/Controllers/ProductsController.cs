using Microsoft.AspNetCore.Mvc;
using ProductCatalogueApi.Interfaces;
using ProductCatalogueApi.Models;
using System.Collections.Generic;

namespace ProductCatalogueApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly IProductService _productService;

        public ProductsController(IProductService productService)
        {
            _productService = productService;
        }

        [HttpGet]
        public IEnumerable<Product> GetProducts()
        {
            return _productService.GetProducts();
        }

        [HttpGet("{id}")]
        public IActionResult GetProductById(int id)
        {
            var product = _productService.GetProductById(id);
            if (product == null)
                return NotFound();

            var productType = _productService.GetProductTypeById(product.ProductTypeId);
            if (productType == null)
                return NotFound();

            var productWithCategory = new ProductWithCategory
            {
                Id = product.Id,
                Name = product.Name,
                Description = product.Description,
                ProductTypeName = productType.Name
            };

            return Ok(productWithCategory);
        }

        [HttpPost]
        public IActionResult CreateProduct(Product product)
        {
            var createdProduct = _productService.CreateProduct(product);

            // Get the corresponding product type
            var productType = _productService.GetProductTypeById(product.ProductTypeId);
            if (productType != null)
            {
                // Add the created product to the product type's products list
                productType.Products.Add(createdProduct);
            }

            return CreatedAtAction(nameof(GetProductById), new { id = createdProduct.Id }, createdProduct);
        }

        [HttpPut("{id}")]
        public IActionResult UpdateProduct(int id, Product product)
        {
            if (id != product.Id)
                return BadRequest();

            var updatedProduct = _productService.UpdateProduct(product);
            if (updatedProduct == null)
                return NotFound();

            return Ok(updatedProduct);
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteProduct(int id)
        {
            var deletedProduct = _productService.DeleteProduct(id);
            if (deletedProduct == null)
                return NotFound();

            return NoContent();
        }

        [HttpGet("product-types")]
        public IActionResult GetProductTypes()
        {
            var productTypes = _productService.GetProductTypes();
            return Ok(productTypes);
        }
    }
}
