namespace Property_management_system.Models.DTO
{
    public class CreateMaintenanceRequestDto
    {
        public Guid PropertyID { get; set; }
        public Guid TenantID { get; set; }
        public string IssueDescription { get; set; }
        public string Status { get; set; }
    }
}
