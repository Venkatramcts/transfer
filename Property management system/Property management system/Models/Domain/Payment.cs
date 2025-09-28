using System.ComponentModel.DataAnnotations;

namespace Property_management_system.Models.Domain
{
    public class Payment
    {
        [Key]
        public Guid PaymentID { get; set; }
        public Guid LeaseID { get; set; }
        public decimal Amount { get; set; }
        public DateTime PaymentDate { get; set; }
        public string Status { get; set; }

        // Navigation property
        public Lease Lease { get; set; }
    }
}
