namespace Property_management_system.Models.DTO
{
    public class CreatePropertyRequestDto
    {
        public Guid OwnerID { get; set; }

        public string PropertyName { get; set; } // ✅ New field

        public string Address { get; set; }

        public decimal RentAmount { get; set; }

        public bool AvailabilityStatus { get; set; }
    }
}
