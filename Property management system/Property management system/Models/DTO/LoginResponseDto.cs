namespace Property_management_system.Models.DTO
{
    public class LoginResponseDto
    {
        public string Email { get; set; }
        public List<string> Roles { get; set; }
        public string Token { get; set; }
        public Guid? OwnerID { get; set; } // ✅ Added
        public Guid? TenantID { get; set; } // ✅ Added
    }
}
