using Application.Common.Repositories;
using Application.Features.NumberSequenceManager;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.SeedManager.Demos
{
    public class DepartmentSeeder
    {
        private readonly ICommandRepository<Department> _departmentRepository;

        private readonly IUnitOfWork _unitOfWork;

        public DepartmentSeeder(
            ICommandRepository<Department> departmentRepository,
            IUnitOfWork unitOfWork
        )
        {
            _departmentRepository = departmentRepository;
            _unitOfWork = unitOfWork;
        }

       
        public async Task GenerateDataAsync()
        {

            var departments = new List<Department>
        {
            new() { Name = "الإدارة", Description = "الإدارة العامة" },
            new() { Name = "الموارد البشرية", Description = "شؤون الموظفين" },
            new() { Name = "الحسابات", Description = "الإدارة المالية" },
            new() { Name = "تقنية المعلومات", Description = "الدعم التقني والأنظمة" },
            new() { Name = "التسويق", Description = "التسويق والمبيعات" }
        };

            foreach (var department in departments)
            {
                await _departmentRepository.CreateAsync(department);
            }

            await _unitOfWork.SaveAsync();
        }
    }
}
