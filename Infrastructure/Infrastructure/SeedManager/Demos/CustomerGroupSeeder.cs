using Application.Common.Repositories;
using Domain.Entities;

namespace Infrastructure.SeedManager.Demos;

public class CustomerGroupSeeder
{
    private readonly ICommandRepository<CustomerGroup> _groupRepository;
    private readonly IUnitOfWork _unitOfWork;

    public CustomerGroupSeeder(
        ICommandRepository<CustomerGroup> groupRepository,
        IUnitOfWork unitOfWork
    )
    {
        _groupRepository = groupRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task GenerateDataAsync()
    {
        var customerGroups = new List<CustomerGroup>
        {
		 new CustomerGroup { Name = "شركات" },
new CustomerGroup { Name = "حكومي" },
new CustomerGroup { Name = "مؤسسات" },
new CustomerGroup { Name = "عسكري" },
new CustomerGroup { Name = "تعليم" },
new CustomerGroup { Name = "ضيافة" }

		};

        foreach (var group in customerGroups)
        {
            await _groupRepository.CreateAsync(group);
        }

        await _unitOfWork.SaveAsync();
    }
}


