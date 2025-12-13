using Application.Common.Repositories;
using Domain.Entities;

namespace Infrastructure.SeedManager.Demos
{
    public class WarehouseSeeder
    {
        private readonly ICommandRepository<Warehouse> _repository;
        private readonly IUnitOfWork _unitOfWork;

        public WarehouseSeeder(
            ICommandRepository<Warehouse> repository,
            IUnitOfWork unitOfWork
        )
        {
            _repository = repository;
            _unitOfWork = unitOfWork;
        }

        public async Task GenerateDataAsync()
        {
            var warehouses = new List<Warehouse>
            {
                new Warehouse { Name = "مخزن الزقازيق" },
                new Warehouse { Name = "مخزن القاهره" },
                new Warehouse { Name = "مخزن 3" },
                new Warehouse { Name = "4 مخزن" }
            };

            foreach (var warehouse in warehouses)
            {
                await _repository.CreateAsync(warehouse);
            }

            await _unitOfWork.SaveAsync();
        }
    }
}
