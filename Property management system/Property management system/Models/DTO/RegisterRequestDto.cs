namespace Property_management_system.Models.DTO
{
    public class RegisterRequestDto
    {
        public string Email { get; set; }
        public string Password { get; set; }
        public string Role { get; set; } // Writer, Tenant, Admin
    }
}
