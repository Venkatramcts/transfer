using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Property_management_system.Models.DTO;
using Property_management_system.Models.Domain;
using Property_management_system.Repositories.Interface;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace Property_management_system.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<IdentityUser> userManager;
        private readonly ITokenRepository tokenRepository;
        private readonly RoleManager<IdentityRole> roleManager;
        private readonly IOwnerRepository ownerRepository;
        private readonly ITenantRepository tenantRepository;

        public AuthController(
            UserManager<IdentityUser> userManager,
            ITokenRepository tokenRepository,
            RoleManager<IdentityRole> roleManager,
            IOwnerRepository ownerRepository,
            ITenantRepository tenantRepository)
        {
            this.userManager = userManager;
            this.tokenRepository = tokenRepository;
            this.roleManager = roleManager;
            this.ownerRepository = ownerRepository;
            this.tenantRepository = tenantRepository;
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] LoginRequestDto request)
        {
            if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
            {
                ModelState.AddModelError("Login", "Email and Password are required.");
                return ValidationProblem(ModelState);
            }

            var identityUser = await userManager.FindByEmailAsync(request.Email);
            if (identityUser == null || !await userManager.CheckPasswordAsync(identityUser, request.Password))
            {
                ModelState.AddModelError("Login", "Email or Password Incorrect.");
                return ValidationProblem(ModelState);
            }

            var roles = await userManager.GetRolesAsync(identityUser);

            Guid? ownerId = null;
            Guid? tenantId = null;

            if (roles.Contains("Owner"))
            {
                var owner = (await ownerRepository.GetAllAsync())
                    .FirstOrDefault(o => o.Email.ToLower() == request.Email.ToLower());

                if (owner == null)
                    return Unauthorized("Owner account has been deleted.");

                ownerId = owner.OwnerID;
            }

            if (roles.Contains("Tenant"))
            {
                var tenant = (await tenantRepository.GetAllAsync())
                    .FirstOrDefault(t => t.ContactDetails.ToLower() == request.Email.ToLower());

                if (tenant == null)
                    return Unauthorized("Tenant account has been deleted.");

                tenantId = tenant.TenantID;
            }

            var token = tokenRepository.CreateJwtToken(identityUser, roles.ToList());

            return Ok(new LoginResponseDto
            {
                Email = request.Email,
                Roles = roles.ToList(),
                Token = token,
                OwnerID = ownerId,
                TenantID = tenantId
            });
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequestDto request)
        {
            if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password) || string.IsNullOrWhiteSpace(request.Role))
            {
                ModelState.AddModelError("Registration", "Email, Password, and Role are required.");
                return ValidationProblem(ModelState);
            }

            var user = new IdentityUser
            {
                UserName = request.Email.Trim(),
                Email = request.Email.Trim()
            };

            var result = await userManager.CreateAsync(user, request.Password);
            if (!result.Succeeded)
            {
                foreach (var error in result.Errors)
                    ModelState.AddModelError("Registration", error.Description);

                return ValidationProblem(ModelState);
            }

            var roleInput = request.Role.Trim().ToLowerInvariant();
            string role = roleInput switch
            {
                "owner" => "Owner",
                "tenant" => "Tenant",
                _ => null
            };

            if (role == null)
                return BadRequest($"Role '{request.Role}' is not recognized.");

            if (!await roleManager.RoleExistsAsync(role))
                return BadRequest($"Role '{role}' does not exist.");

            var roleResult = await userManager.AddToRoleAsync(user, role);
            if (!roleResult.Succeeded)
            {
                foreach (var error in roleResult.Errors)
                    ModelState.AddModelError("RoleAssignment", error.Description);

                return ValidationProblem(ModelState);
            }

            Guid? ownerId = null;
            Guid? tenantId = null;

            if (role == "Owner")
            {
                var owner = new Owner
                {
                    Name = request.Email.Split('@')[0],
                    Email = request.Email
                };

                var createdOwner = await ownerRepository.CreateAsync(owner);
                ownerId = createdOwner.OwnerID;
            }

            if (role == "Tenant")
            {
                var tenant = new Tenant
                {
                    ContactDetails = request.Email,
                    RentalHistory = "New Tenant"
                };

                var createdTenant = await tenantRepository.CreateAsync(tenant);
                tenantId = createdTenant.TenantID;
            }

            return Ok(new
            {
                Message = "User registered successfully.",
                user.Email,
                Role = role,
                OwnerID = ownerId,
                TenantID = tenantId
            });
        }


        [HttpGet("token-details")]
        [Authorize]
        public async Task<IActionResult> GetTokenDetails()
        {
            var authHeader = Request.Headers["Authorization"].ToString();
            if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Bearer "))
                return BadRequest("No JWT token found in Authorization header.");

            var token = authHeader.Substring("Bearer ".Length).Trim();
            var handler = new JwtSecurityTokenHandler();

            try
            {
                var jwtToken = handler.ReadJwtToken(token);
                var claims = jwtToken.Claims
                    .GroupBy(c => c.Type)
                    .ToDictionary(g => g.Key, g => g.Select(c => c.Value).ToList());

                var email = claims.TryGetValue(ClaimTypes.Email, out var emailList) ? emailList.FirstOrDefault() : null;
                var userId = claims.TryGetValue(ClaimTypes.NameIdentifier, out var idList) ? idList.FirstOrDefault() : null;
                var roles = claims.TryGetValue(ClaimTypes.Role, out var roleList) ? roleList : new List<string>();

                Guid? ownerId = null;
                Guid? tenantId = null;

                if (roles.Contains("Owner") && email != null)
                {
                    var owner = (await ownerRepository.GetAllAsync())
                        .FirstOrDefault(o => o.Email.ToLower() == email.ToLower());

                    if (owner != null)
                        ownerId = owner.OwnerID;
                }

                if (roles.Contains("Tenant") && email != null)
                {
                    var tenant = (await tenantRepository.GetAllAsync())
                        .FirstOrDefault(t => t.ContactDetails.ToLower() == email.ToLower());

                    if (tenant != null)
                        tenantId = tenant.TenantID;
                }

                var tokenDetails = new
                {
                    UserId = userId,
                    Email = email,
                    Roles = roles,
                    OwnerID = ownerId,
                    TenantID = tenantId,
                    Issuer = jwtToken.Issuer,
                    Audience = jwtToken.Audiences.ToList(),
                    Expiry = jwtToken.ValidTo,
                    Claims = claims
                };

                return Ok(tokenDetails);
            }
            catch
            {
                return BadRequest("Invalid JWT token.");
            }
        }


    }
}
