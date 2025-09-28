using System.ComponentModel.DataAnnotations;

namespace Property_management_system.Models.Domain
{
    public class Lease
    {
        [Key]
        public Guid LeaseID { get; set; }
        public Guid PropertyID { get; set; }
        public Guid TenantID { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public decimal RentAmount { get; set; }
        public string Status { get; set; }
        public DateTime CreatedAt { get; set; }

        // Navigation properties
        public Property Property { get; set; }
        public Tenant Tenant { get; set; }
        public List<Payment> Payments { get; set; }
    }
}
