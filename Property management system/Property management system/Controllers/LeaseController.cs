using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Property_management_system.Models.DTO;
using Property_management_system.Models.Domain;
using Property_management_system.Repositories.Interface;

namespace Property_management_system.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class LeaseController : ControllerBase
    {
        private readonly ILeaseRepository leaseRepository;

        public LeaseController(ILeaseRepository leaseRepository)
        {
            this.leaseRepository = leaseRepository;
        }

        [HttpGet]
        [Authorize(Roles = "Tenant,Owner,Admin")]
        public async Task<IActionResult> GetAllLeases()
        {
            var leases = await leaseRepository.GetAllAsync();
            var response = leases.Select(l => new LeaseResponseDto
            {
                LeaseID = l.LeaseID,
                PropertyID = l.PropertyID,
                TenantID = l.TenantID,
                StartDate = l.StartDate,
                EndDate = l.EndDate,
                RentAmount = l.RentAmount,
                Status = l.Status,
                CreatedAt = l.CreatedAt
            });

            return Ok(response);
        }

        [HttpGet("tenant/{tenantId:Guid}")]
        [Authorize(Roles = "Tenant")]
        public async Task<IActionResult> GetLeasesByTenant([FromRoute] Guid tenantId)
        {
            var leases = await leaseRepository.GetAllAsync();
            var filtered = leases.Where(l => l.TenantID == tenantId);

            var response = filtered.Select(l => new LeaseResponseDto
            {
                LeaseID = l.LeaseID,
                PropertyID = l.PropertyID,
                TenantID = l.TenantID,
                StartDate = l.StartDate,
                EndDate = l.EndDate,
                RentAmount = l.RentAmount,
                Status = l.Status,
                CreatedAt = l.CreatedAt
            });

            return Ok(response);
        }


        [HttpGet("{id:Guid}")]
        [Authorize(Roles = "Tenant,Owner,Admin")]
        public async Task<IActionResult> GetLeaseById([FromRoute] Guid id)
        {
            var lease = await leaseRepository.GetByIdAsync(id);
            if (lease == null) return NotFound();

            var response = new LeaseResponseDto
            {
                LeaseID = lease.LeaseID,
                PropertyID = lease.PropertyID,
                TenantID = lease.TenantID,
                StartDate = lease.StartDate,
                EndDate = lease.EndDate,
                RentAmount = lease.RentAmount,
                Status = lease.Status,
                CreatedAt = lease.CreatedAt
            };

            return Ok(response);
        }

        [HttpPost]
        [Authorize(Roles = "Tenant,Owner,Admin")]
        public async Task<IActionResult> CreateLease([FromBody] CreateLeaseRequestDto request)
        {
            var lease = new Lease
            {
                PropertyID = request.PropertyID,
                TenantID = request.TenantID,
                StartDate = request.StartDate,
                EndDate = request.EndDate,
                RentAmount = request.RentAmount,
                Status = request.Status
            };

            var createdLease = await leaseRepository.CreateAsync(lease);

            var response = new LeaseResponseDto
            {
                LeaseID = createdLease.LeaseID,
                PropertyID = createdLease.PropertyID,
                TenantID = createdLease.TenantID,
                StartDate = createdLease.StartDate,
                EndDate = createdLease.EndDate,
                RentAmount = createdLease.RentAmount,
                Status = createdLease.Status,
                CreatedAt = createdLease.CreatedAt
            };

            return Ok(response);
        }

        [HttpPut("{id:Guid}")]
        [Authorize(Roles = "Tenant,Owner,Admin")]
        public async Task<IActionResult> UpdateLease([FromRoute] Guid id, [FromBody] UpdateLeaseRequestDto request)
        {
            var lease = new Lease
            {
                PropertyID = request.PropertyID,
                TenantID = request.TenantID,
                StartDate = request.StartDate,
                EndDate = request.EndDate,
                RentAmount = request.RentAmount,
                Status = request.Status
            };

            var updatedLease = await leaseRepository.UpdateAsync(id, lease);
            if (updatedLease == null) return NotFound();

            var response = new LeaseResponseDto
            {
                LeaseID = updatedLease.LeaseID,
                PropertyID = updatedLease.PropertyID,
                TenantID = updatedLease.TenantID,
                StartDate = updatedLease.StartDate,
                EndDate = updatedLease.EndDate,
                RentAmount = updatedLease.RentAmount,
                Status = updatedLease.Status,
                CreatedAt = updatedLease.CreatedAt
            };

            return Ok(response);
        }

        [HttpDelete("{id:Guid}")]
        [Authorize(Roles = "Tenant,Owner,Admin")]
        public async Task<IActionResult> DeleteLease([FromRoute] Guid id)
        {
            var deletedLease = await leaseRepository.DeleteAsync(id);
            if (deletedLease == null) return NotFound();

            var response = new LeaseResponseDto
            {
                LeaseID = deletedLease.LeaseID,
                PropertyID = deletedLease.PropertyID,
                TenantID = deletedLease.TenantID,
                StartDate = deletedLease.StartDate,
                EndDate = deletedLease.EndDate,
                RentAmount = deletedLease.RentAmount,
                Status = deletedLease.Status,
                CreatedAt = deletedLease.CreatedAt
            };

            return Ok(response);
        }
    }
}
