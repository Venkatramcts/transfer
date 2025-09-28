using System.ComponentModel.DataAnnotations;

namespace Property_management_system.Models.Domain
{
    public class CartItem
    {
        [Key]
        public Guid Id { get; set; }
        public Guid CartId { get; set; }
        public Guid PropertyId { get; set; }
        public decimal Price { get; set; }
        public bool Selected { get; set; } = false;

        public Cart Cart { get; set; }
    }
}
