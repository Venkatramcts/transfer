namespace Property_management_system.Models.DTO
{
    public class MaintenanceRequestResponseDto
    {
        public Guid RequestID { get; set; }
        public Guid PropertyID { get; set; }
        public Guid TenantID { get; set; }
        public string IssueDescription { get; set; }
        public string Status { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
