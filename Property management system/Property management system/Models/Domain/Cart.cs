using System.ComponentModel.DataAnnotations;

namespace Property_management_system.Models.Domain
{
    public class Cart
    {
        [Key]
        public Guid Id { get; set; }
        public Guid TenantId { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;

        public ICollection<CartItem> Items { get; set; } = new List<CartItem>();
    }
}
