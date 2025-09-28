using Microsoft.EntityFrameworkCore;
using Property_management_system.Data;
using Property_management_system.Models.Domain;
using Property_management_system.Repositories.Interface;

namespace Property_management_system.Repositories.Implementation
{
    public class PaymentRepository : IPaymentRepository
    {
        private readonly PropertyDbContext dbContext;

        public PaymentRepository(PropertyDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        // Get all payments
        public async Task<List<Payment>> GetAllAsync()
        {
            return await dbContext.Payments.ToListAsync();
        }

        // Get payment by PaymentID
        public async Task<Payment?> GetByIdAsync(Guid id)
        {
            return await dbContext.Payments.FirstOrDefaultAsync(p => p.PaymentID == id);
        }

        // Get payments by LeaseID
        public async Task<List<Payment>> GetByLeaseIdAsync(Guid leaseId)
        {
            return await dbContext.Payments
                .Where(p => p.LeaseID == leaseId)
                .ToListAsync();
        }

        // Create payment
        public async Task<Payment> CreateAsync(Payment payment)
        {
            payment.PaymentID = Guid.NewGuid();
            await dbContext.Payments.AddAsync(payment);
            await dbContext.SaveChangesAsync();
            return payment;
        }
    }
}
