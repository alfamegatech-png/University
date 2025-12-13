using Application.Common.Repositories;
using Domain.Entities;

namespace Infrastructure.SeedManager.Demos;

public class VendorCategorySeeder
{
    private readonly ICommandRepository<VendorCategory> _categoryRepository;
    private readonly IUnitOfWork _unitOfWork;

    public VendorCategorySeeder(
        ICommandRepository<VendorCategory> categoryRepository,
        IUnitOfWork unitOfWork
    )
    {
        _categoryRepository = categoryRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task GenerateDataAsync()
    {
        var vendorCategories = new List<VendorCategory>
        {
		   new VendorCategory { Name = "كبير" },
new VendorCategory { Name = "متوسط" },
new VendorCategory { Name = "صغير" },
new VendorCategory { Name = "متخصص" },
new VendorCategory { Name = "محلي" },
new VendorCategory { Name = "عالمي" }

		};

        foreach (var category in vendorCategories)
        {
            await _categoryRepository.CreateAsync(category);
        }

        await _unitOfWork.SaveAsync();
    }
}
