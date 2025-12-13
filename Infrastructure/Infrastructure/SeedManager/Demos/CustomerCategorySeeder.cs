using Application.Common.Repositories;
using Domain.Entities;

namespace Infrastructure.SeedManager.Demos;

public class CustomerCategorySeeder
{
    private readonly ICommandRepository<CustomerCategory> _categoryRepository;
    private readonly IUnitOfWork _unitOfWork;

    public CustomerCategorySeeder(
        ICommandRepository<CustomerCategory> categoryRepository,
        IUnitOfWork unitOfWork
    )
    {
        _categoryRepository = categoryRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task GenerateDataAsync()
    {
        var customerCategories = new List<CustomerCategory>
        {
  new CustomerCategory { Name = "كبير" },      // Enterprise
new CustomerCategory { Name = "متوسط" },    // Medium
new CustomerCategory { Name = "صغير" },      // Small
new CustomerCategory { Name = "شركة ناشئة" }, // Startup
new CustomerCategory { Name = "صغير جداً" }  // Micro

        };

        foreach (var category in customerCategories)
        {
            await _categoryRepository.CreateAsync(category);
        }

        await _unitOfWork.SaveAsync();
    }
}


