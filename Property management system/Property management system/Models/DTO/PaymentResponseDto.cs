namespace Property_management_system.Models.DTO
{
    public class PaymentResponseDto
    {
        public Guid PaymentID { get; set; }
        public Guid LeaseID { get; set; }
        public decimal Amount { get; set; }
        public DateTime PaymentDate { get; set; }
        public string Status { get; set; }
    }
}
