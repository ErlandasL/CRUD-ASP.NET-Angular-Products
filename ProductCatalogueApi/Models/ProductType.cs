using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ProductCatalogueApi.Models
{
    public class ProductType
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Name { get; set; }
        public List<Product> Products { get; set; } = new List<Product>();
    }
}
