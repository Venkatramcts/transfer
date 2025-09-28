using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Property_management_system.Data
{
    public class AuthDbContext : IdentityDbContext<IdentityUser>
    {
        public AuthDbContext(DbContextOptions<AuthDbContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // Role IDs
            var tenantRoleId = "a1b2c3d4-e5f6-7890-abcd-tenantroleid";
            var ownerRoleId = "b2c3d4e5-f6a7-8901-bcde-ownerroleid";
            var adminRoleId = "c3d4e5f6-a7b8-9012-cdef-adminroleid"; // NEW Admin Role ID

            // Seed Roles
            builder.Entity<IdentityRole>().HasData(new List<IdentityRole>
    {
        new IdentityRole
        {
            Id = tenantRoleId,
            Name = "Tenant",
            NormalizedName = "TENANT",
            ConcurrencyStamp = tenantRoleId
        },
        new IdentityRole
        {
            Id = ownerRoleId,
            Name = "Owner",
            NormalizedName = "OWNER",
            ConcurrencyStamp = ownerRoleId
        },
        new IdentityRole
        {
            Id = adminRoleId,
            Name = "Admin",
            NormalizedName = "ADMIN",
            ConcurrencyStamp = adminRoleId
        }
    });

            // Seed Superuser
            var adminUserId = "admin-user-1234-5678-9012-adminid";
            var admin = new IdentityUser
            {
                Id = adminUserId,
                UserName = "admin@propertysystem.com",
                NormalizedUserName = "ADMIN@PROPERTYSYSTEM.COM",
                Email = "admin@propertysystem.com",
                NormalizedEmail = "ADMIN@PROPERTYSYSTEM.COM",
                EmailConfirmed = true,
                SecurityStamp = Guid.NewGuid().ToString()
            };

            admin.PasswordHash = new PasswordHasher<IdentityUser>().HashPassword(admin, "Admin@123");
            builder.Entity<IdentityUser>().HasData(admin);

            // Assign Admin role to superuser
            builder.Entity<IdentityUserRole<string>>().HasData(new List<IdentityUserRole<string>>
    {
        new IdentityUserRole<string> { UserId = adminUserId, RoleId = adminRoleId }
    });
        }


    }
}
