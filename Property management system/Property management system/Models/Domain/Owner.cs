using System.ComponentModel.DataAnnotations;

namespace Property_management_system.Models.Domain
{
    public class Owner
    {
        [Key]
        public Guid OwnerID { get; set; } = Guid.NewGuid();

        [Required]
        public string Name { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        public List<Property> Properties { get; set; }
    }
}
