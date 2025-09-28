using Property_management_system.Models.DTO;
using Property_management_system.Models.Domain;
using Property_management_system.Repositories.Interface;
using Property_management_system.Services.Interface;

namespace Property_management_system.Services.Implementation
{
    public class OwnerService : IOwnerService
    {
        private readonly IOwnerRepository ownerRepository;

        public OwnerService(IOwnerRepository ownerRepository)
        {
            this.ownerRepository = ownerRepository;
        }

        public async Task<IEnumerable<OwnerResponseDto>> GetAllOwnersAsync()
        {
            var owners = await ownerRepository.GetAllAsync();
            return owners.Select(o => new OwnerResponseDto
            {
                OwnerID = o.OwnerID,
                Name = o.Name,
                Email = o.Email
            });
        }

        public async Task<OwnerResponseDto?> GetOwnerByIdAsync(Guid id)
        {
            var owner = await ownerRepository.GetByIdAsync(id);
            if (owner == null) return null;

            return new OwnerResponseDto
            {
                OwnerID = owner.OwnerID,
                Name = owner.Name,
                Email = owner.Email
            };
        }

        public async Task<OwnerResponseDto> CreateOwnerAsync(CreateOwnerRequestDto request)
        {
            var owner = new Owner
            {
                Name = request.Name,
                Email = request.Email
            };

            var createdOwner = await ownerRepository.CreateAsync(owner);

            return new OwnerResponseDto
            {
                OwnerID = createdOwner.OwnerID,
                Name = createdOwner.Name,
                Email = createdOwner.Email
            };
        }

        public async Task<OwnerResponseDto?> UpdateOwnerAsync(Guid id, UpdateOwnerRequestDto request)
        {
            var updatedOwner = new Owner
            {
                Name = request.Name,
                Email = request.Email
            };

            var result = await ownerRepository.UpdateAsync(id, updatedOwner);
            if (result == null) return null;

            return new OwnerResponseDto
            {
                OwnerID = result.OwnerID,
                Name = result.Name,
                Email = result.Email
            };
        }

        public async Task<OwnerResponseDto?> DeleteOwnerAsync(Guid id)
        {
            var deletedOwner = await ownerRepository.DeleteAsync(id);
            if (deletedOwner == null) return null;

            return new OwnerResponseDto
            {
                OwnerID = deletedOwner.OwnerID,
                Name = deletedOwner.Name,
                Email = deletedOwner.Email
            };
        }
    }
}
