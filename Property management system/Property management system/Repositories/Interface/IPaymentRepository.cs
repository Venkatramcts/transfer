using Property_management_system.Models.Domain;

namespace Property_management_system.Repositories.Interface
{
    public interface IPaymentRepository
    {
        // Get all payments (all transactions)
        Task<List<Payment>> GetAllAsync();

        // Get a single payment by PaymentID
        Task<Payment?> GetByIdAsync(Guid id);

        // Get all payments for a specific lease
        Task<List<Payment>> GetByLeaseIdAsync(Guid leaseId);

        // Create a new payment
        Task<Payment> CreateAsync(Payment payment);
    }
}
