using System.ComponentModel.DataAnnotations;

namespace Property_management_system.Models.Domain
{
    public class MaintenanceRequest
    {
        [Key]
        public Guid RequestID { get; set; }
        public Guid PropertyID { get; set; }
        public Guid TenantID { get; set; }
        public string IssueDescription { get; set; }
        public string Status { get; set; }
        public DateTime CreatedAt { get; set; }

        // Navigation properties
        public Property Property { get; set; }
        public Tenant Tenant { get; set; }
    }
}
