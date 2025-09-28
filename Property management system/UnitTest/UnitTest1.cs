using Moq;
using Property_management_system.Models.Domain;
using Property_management_system.Repositories.Interface;

namespace UnitTest
{
    public class Tests
    {
        private Mock<IOwnerRepository> mockOwnerRepo;

        [SetUp]
        public void Setup()
        {
            mockOwnerRepo = new Mock<IOwnerRepository>();
        }

        [Test]
        public async Task CreateAsync_ShouldReturnCreatedOwner()
        {
            // Arrange
            var owner = new Owner { OwnerID = Guid.NewGuid(), Name = "Test Owner", Email = "test@example.com" };
            mockOwnerRepo.Setup(repo => repo.CreateAsync(It.IsAny<Owner>())).ReturnsAsync(owner);

            // Act
            var result = await mockOwnerRepo.Object.CreateAsync(owner);

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(owner.Name, result.Name);
        }

        [Test]
        public async Task GetByIdAsync_ShouldReturnOwner_WhenExists()
        {
            var ownerId = Guid.NewGuid();
            var owner = new Owner { OwnerID = ownerId, Name = "Test Owner", Email = "test@example.com" };
            mockOwnerRepo.Setup(repo => repo.GetByIdAsync(ownerId)).ReturnsAsync(owner);

            var result = await mockOwnerRepo.Object.GetByIdAsync(ownerId);

            Assert.IsNotNull(result);
            Assert.AreEqual(ownerId, result.OwnerID);
        }

        [Test]
        public async Task GetByIdAsync_ShouldReturnNull_WhenNotFound()
        {
            mockOwnerRepo.Setup(repo => repo.GetByIdAsync(It.IsAny<Guid>())).ReturnsAsync((Owner)null);

            var result = await mockOwnerRepo.Object.GetByIdAsync(Guid.NewGuid());

            Assert.IsNull(result);
        }

        [Test]
        public async Task GetAllAsync_ShouldReturnListOfOwners()
        {
            var owners = new List<Owner>
            {
                new Owner { OwnerID = Guid.NewGuid(), Name = "Owner1", Email = "owner1@example.com" },
                new Owner { OwnerID = Guid.NewGuid(), Name = "Owner2", Email = "owner2@example.com" }
            };
            mockOwnerRepo.Setup(repo => repo.GetAllAsync()).ReturnsAsync(owners);

            var result = await mockOwnerRepo.Object.GetAllAsync();

            Assert.IsNotNull(result);
            Assert.AreEqual(2, result.Count);
        }

        [Test]
        public async Task UpdateAsync_ShouldReturnUpdatedOwner_WhenExists()
        {
            var ownerId = Guid.NewGuid();
            var updatedOwner = new Owner { OwnerID = ownerId, Name = "Updated", Email = "updated@example.com" };
            mockOwnerRepo.Setup(repo => repo.UpdateAsync(ownerId, It.IsAny<Owner>())).ReturnsAsync(updatedOwner);

            var result = await mockOwnerRepo.Object.UpdateAsync(ownerId, updatedOwner);

            Assert.IsNotNull(result);
            Assert.AreEqual("Updated", result.Name);
        }

        [Test]
        public async Task DeleteAsync_ShouldReturnDeletedOwner_WhenExists()
        {
            var ownerId = Guid.NewGuid();
            var deletedOwner = new Owner { OwnerID = ownerId, Name = "Deleted", Email = "deleted@example.com" };
            mockOwnerRepo.Setup(repo => repo.DeleteAsync(ownerId)).ReturnsAsync(deletedOwner);

            var result = await mockOwnerRepo.Object.DeleteAsync(ownerId);

            Assert.IsNotNull(result);
            Assert.AreEqual(ownerId, result.OwnerID);
        }

        [Test]
        public async Task DeleteAsync_ShouldReturnNull_WhenNotFound()
        {
            mockOwnerRepo.Setup(repo => repo.DeleteAsync(It.IsAny<Guid>())).ReturnsAsync((Owner)null);

            var result = await mockOwnerRepo.Object.DeleteAsync(Guid.NewGuid());

            Assert.IsNull(result);
        }
    }
}
