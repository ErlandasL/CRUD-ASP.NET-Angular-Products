using ProductCatalogueApi.Models;
using System.Collections.Generic;

namespace ProductCatalogueApi.Interfaces
{
    public interface IProductService
    {
        IEnumerable<Product> GetProducts();
        Product GetProductById(int id);
        Product CreateProduct(Product product);
        Product UpdateProduct(Product product);
        Product DeleteProduct(int id);
    }
}
