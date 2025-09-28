using System.ComponentModel.DataAnnotations;

namespace Property_management_system.Models.Domain
{
    public class Tenant
    {
        [Key]
        public Guid TenantID { get; set; }
        public string ContactDetails { get; set; }
        public string RentalHistory { get; set; }

        // Navigation properties
        public List<Lease> Leases { get; set; }
        public List<MaintenanceRequest> MaintenanceRequests { get; set; }
    }
}
