using Property_management_system.Models.DTO;
using Property_management_system.Models.Domain;

namespace Property_management_system.Services.Interface
{
    public interface IOwnerService
    {
        Task<IEnumerable<OwnerResponseDto>> GetAllOwnersAsync();
        Task<OwnerResponseDto?> GetOwnerByIdAsync(Guid id);
        Task<OwnerResponseDto> CreateOwnerAsync(CreateOwnerRequestDto request);
        Task<OwnerResponseDto?> UpdateOwnerAsync(Guid id, UpdateOwnerRequestDto request);
        Task<OwnerResponseDto?> DeleteOwnerAsync(Guid id);
    }
}
