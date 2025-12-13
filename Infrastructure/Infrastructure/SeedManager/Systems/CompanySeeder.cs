using Application.Common.Repositories;
using Domain.Entities;

namespace Infrastructure.SeedManager.Systems;

public class CompanySeeder
{
    private readonly ICommandRepository<Company> _repository;
    private readonly IUnitOfWork _unitOfWork;
    public CompanySeeder(
        ICommandRepository<Company> repository,
        IUnitOfWork unitOfWork
        )
    {
        _repository = repository;
        _unitOfWork = unitOfWork;
    }
    public async Task GenerateDataAsync()
    {
		var entity = new Company
		{
			CreatedAtUtc = DateTime.UtcNow,
			IsDeleted = false,
			Name = "شركة المتحدة",
			Currency = "دولار أمريكي",
			Street = " الشارع الرئيسي",
			City = "القاهرة",
			State = "مصر",
			ZipCode = "10001",
			Country = "مصر ",
			PhoneNumber = "+02989889899",
			FaxNumber = "+1-212-555-5678",
			EmailAddress = "info@nationals.com",
			Website = "https://www.nationals.com"
		};


		await _repository.CreateAsync(entity);
        await _unitOfWork.SaveAsync();
    }

}
