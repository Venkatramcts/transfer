using System.ComponentModel.DataAnnotations;

namespace Property_management_system.Models.Domain
{
    public class Property
    {
        [Key]
        public Guid PropertyID { get; set; }

        [Required]
        public Guid OwnerID { get; set; }

        [Required]
        [MaxLength(200)]
        public string PropertyName { get; set; }  // ✅ New field

        [Required]
        public string Address { get; set; }

        [Range(0, double.MaxValue)]
        public decimal RentAmount { get; set; }

        public bool AvailabilityStatus { get; set; }

        public string Status { get; set; } = "Available";


        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public Owner Owner { get; set; }
        public List<Lease> Leases { get; set; }
        public List<MaintenanceRequest> MaintenanceRequests { get; set; }

        //public List<Image> Images { get; set; }
    }
}
