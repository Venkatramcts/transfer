namespace Property_management_system.Models.DTO
{
    public class CartItemDto
    {
        public Guid Id { get; set; }
        public Guid PropertyId { get; set; }
        public decimal Price { get; set; }
        public bool Selected { get; set; }
    }

    public class CartDto
    {
        public Guid Id { get; set; }
        public Guid TenantId { get; set; }
        public List<CartItemDto> Items { get; set; }
    }

    public class AddCartItemDto
    {
        public Guid PropertyId { get; set; }
        public decimal Price { get; set; }
    }

    public class UpdateCartItemSelectionDto
    {
        public bool Selected { get; set; }
    }

    public class PaymentRequestDto
    {
        public string CardNumber { get; set; }
        public string Name { get; set; }
        public string Expiry { get; set; }
        public decimal Amount { get; set; }
    }
}
