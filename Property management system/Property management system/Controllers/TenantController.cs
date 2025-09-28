using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Property_management_system.Models.DTO;
using Property_management_system.Models.Domain;
using Property_management_system.Repositories.Interface;

namespace Property_management_system.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] // All endpoints require authentication
    public class TenantController : ControllerBase
    {
        private readonly ITenantRepository tenantRepository;

        public TenantController(ITenantRepository tenantRepository)
        {
            this.tenantRepository = tenantRepository;
        }

        // GET: api/tenant
        [HttpGet]
        [Authorize(Roles = "Tenant,Owner,Admin")]
        public async Task<IActionResult> GetAllTenants()
        {
            var tenants = await tenantRepository.GetAllAsync();

            var response = tenants.Select(t => new TenantResponseDto
            {
                TenantID = t.TenantID,
                ContactDetails = t.ContactDetails,
                RentalHistory = t.RentalHistory
            });

            return Ok(response);
        }

        // GET: api/tenant/{id}
        [HttpGet("{id:Guid}")]
        [Authorize(Roles = "Tenant,Owner,Admin")]
        public async Task<IActionResult> GetTenantById([FromRoute] Guid id)
        {
            var tenant = await tenantRepository.GetByIdAsync(id);
            if (tenant == null) return NotFound();

            var response = new TenantResponseDto
            {
                TenantID = tenant.TenantID,
                ContactDetails = tenant.ContactDetails,
                RentalHistory = tenant.RentalHistory
            };

            return Ok(response);
        }

        // POST: api/tenant
        [HttpPost]
        [Authorize(Roles = "Tenant,Owner,Admin")]
        public async Task<IActionResult> CreateTenant([FromBody] CreateTenantRequestDto request)
        {
            var tenant = new Tenant
            {
                ContactDetails = request.ContactDetails,
                RentalHistory = request.RentalHistory
            };

            var createdTenant = await tenantRepository.CreateAsync(tenant);

            var response = new TenantResponseDto
            {
                TenantID = createdTenant.TenantID,
                ContactDetails = createdTenant.ContactDetails,
                RentalHistory = createdTenant.RentalHistory
            };

            return Ok(response);
        }

        // PUT: api/tenant/{id}
        [HttpPut("{id:Guid}")]
        [Authorize(Roles = "Tenant,Owner,Admin")]
        public async Task<IActionResult> UpdateTenant([FromRoute] Guid id, [FromBody] UpdateTenantRequestDto request)
        {
            var updatedTenant = new Tenant
            {
                ContactDetails = request.ContactDetails,
                RentalHistory = request.RentalHistory
            };

            var result = await tenantRepository.UpdateAsync(id, updatedTenant);
            if (result == null) return NotFound();

            var response = new TenantResponseDto
            {
                TenantID = result.TenantID,
                ContactDetails = result.ContactDetails,
                RentalHistory = result.RentalHistory
            };

            return Ok(response);
        }

        // DELETE: api/tenant/{id}
        [HttpDelete("{id:Guid}")]
        [Authorize(Roles = "Tenant,Owner,Admin")]
        public async Task<IActionResult> DeleteTenant([FromRoute] Guid id)
        {
            var deletedTenant = await tenantRepository.DeleteAsync(id);
            if (deletedTenant == null) return NotFound();

            var response = new TenantResponseDto
            {
                TenantID = deletedTenant.TenantID,
                ContactDetails = deletedTenant.ContactDetails,
                RentalHistory = deletedTenant.RentalHistory
            };

            return Ok(response);
        }
    }
}
