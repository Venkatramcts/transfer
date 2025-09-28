namespace Property_management_system.Models.DTO
{
    public class UpdateOwnerRequestDto
    {
        public Guid OwnerID { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
    }
}
