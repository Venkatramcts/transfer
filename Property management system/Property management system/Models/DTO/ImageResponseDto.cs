namespace Property_management_system.Models.DTO
{
    public class ImageResponseDto
    {
        public Guid Id { get; set; }
        public string FileName { get; set; }
        public string ContentType { get; set; }
        public string Base64Data { get; set; }

        public Guid PropertyID { get; set; }
    }
}
