namespace Property_management_system.Models.DTO
{
    public class UpdateLeaseRequestDto
    {
        public Guid PropertyID { get; set; }
        public Guid TenantID { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public decimal RentAmount { get; set; }
        public string Status { get; set; }
    }
}
