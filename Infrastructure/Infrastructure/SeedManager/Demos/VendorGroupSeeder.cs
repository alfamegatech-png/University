using Application.Common.Repositories;
using Domain.Entities;

namespace Infrastructure.SeedManager.Demos;

public class VendorGroupSeeder
{
    private readonly ICommandRepository<VendorGroup> _groupRepository;
    private readonly IUnitOfWork _unitOfWork;

    public VendorGroupSeeder(
        ICommandRepository<VendorGroup> groupRepository,
        IUnitOfWork unitOfWork
    )
    {
        _groupRepository = groupRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task GenerateDataAsync()
    {
        var vendorGroups = new List<VendorGroup>
        {
		   new VendorGroup { Name = "مصنع" },
new VendorGroup { Name = "مورد" },
new VendorGroup { Name = "مقدم خدمة" },
new VendorGroup { Name = "موزع" },
new VendorGroup { Name = "فريلانسر" }

		};

        foreach (var group in vendorGroups)
        {
            await _groupRepository.CreateAsync(group);
        }

        await _unitOfWork.SaveAsync();
    }
}
