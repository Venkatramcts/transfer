namespace Property_management_system.Models.DTO
{
    public class UpdateMaintenanceRequestDto
    {
        public Guid PropertyID { get; set; }
        public Guid TenantID { get; set; }
        public string IssueDescription { get; set; }
        public string Status { get; set; }
    }
}
