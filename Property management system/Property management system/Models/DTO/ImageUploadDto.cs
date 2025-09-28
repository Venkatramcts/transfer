namespace Property_management_system.Models.DTO
{
    public class ImageUploadDto
    {
        public IFormFile File { get; set; }

        public Guid PropertyID { get; set; }
    }
}
