using Application.Common.Repositories;
using Domain.Entities;

namespace Infrastructure.SeedManager.Demos;

public class ProductGroupSeeder
{
    private readonly ICommandRepository<ProductGroup> _productGroupRepository;
    private readonly IUnitOfWork _unitOfWork;

    public ProductGroupSeeder(
        ICommandRepository<ProductGroup> productGroupRepository,
        IUnitOfWork unitOfWork
    )
    {
        _productGroupRepository = productGroupRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task GenerateDataAsync()
    {
        var productGroups = new List<ProductGroup>
        {
new ProductGroup { Name = "أجهزة" },
new ProductGroup { Name = "الشبكات" },
new ProductGroup { Name = "التخزين" },
new ProductGroup { Name = "أجهزة ملحقة" },
new ProductGroup { Name = "البرمجيات" },
new ProductGroup { Name = "الخدمات" }

		};

        foreach (var productGroup in productGroups)
        {
            await _productGroupRepository.CreateAsync(productGroup);
        }

        await _unitOfWork.SaveAsync();
    }
}
