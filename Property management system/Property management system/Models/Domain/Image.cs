namespace Property_management_system.Models.Domain
{
    public class Image
    {
        public Guid Id { get; set; }

        public string FileName { get; set; }
        public string ContentType { get; set; }

        public byte[] Data { get; set; } // Actual image bytes

        public Guid PropertyID { get; set; }
        public Property Property { get; set; }
    }
}
