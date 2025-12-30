using Application.Common.Repositories;
using Application.Features.NumberSequenceManager;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.SeedManager.Demos;

public class EmployeeSeeder
{
    private readonly ICommandRepository<Employee> _EmployeeRepository;
    private readonly ICommandRepository<Department> _departmentRepository;

    private readonly NumberSequenceService _numberSequenceService;
    private readonly IUnitOfWork _unitOfWork;

    public EmployeeSeeder(
        ICommandRepository<Employee> EmployeeRepository,
         ICommandRepository<Department> departmentRepository,
        NumberSequenceService numberSequenceService,
        IUnitOfWork unitOfWork
    )
    {
        _EmployeeRepository = EmployeeRepository;
        _departmentRepository = departmentRepository;
        _numberSequenceService = numberSequenceService;
        _unitOfWork = unitOfWork;
    }

    public async Task GenerateDataAsync()
    {

        var departments = (await _departmentRepository.GetQuery().ToListAsync()).Select(x => x.Id).ToArray();

        var cities = new string[] { "القاهرة", "الإسكندرية", "الجيزة", "المنصورة" };
		var streets = new string[] { "شارع التحرير", "شارع الجمهورية", "شارع سعد زغلول", "شارع عبد الرحمن حسن" };
		var states = new string[] { "القاهرة", "الإسكندرية", "الجيزة", "الدقهلية" };
		var zipCodes = new string[] { "11511", "21511", "12511", "34511" };
		var phoneNumbers = new string[] { "02-12345678", "03-87654321", "02-56781234", "050-4321876" };

		var emailDomains = new string[] { "example.com", "demo.com", "test.com", "sample.com" };

        var random = new Random();

        var Employees = new List<Employee>
        {
new Employee { Name = "العميل 1" },
new Employee { Name = "العميل 2" },
new Employee { Name = "العميل 3" },
new Employee { Name = "العميل 4" },
new Employee { Name = "العميل 5" },
new Employee { Name = "العميل 6" },
new Employee { Name = "العميل 7" },
new Employee { Name = "العميل 8" },
new Employee { Name = "العميل 9" },
new Employee { Name = "العميل 10" },
new Employee { Name = "العميل 11" },
new Employee { Name = "العميل 12" },
new Employee { Name = "العميل 13" },
new Employee { Name = "العميل 14" },
new Employee { Name = "العميل 15" },
new Employee { Name = "العميل 16" },
new Employee { Name = "العميل 17" },
new Employee { Name = "العميل 18" },
new Employee { Name = "العميل 19" },
new Employee { Name = "العميل 20" },
new Employee { Name = "العميل 21" }

		};

        foreach (var Employee in Employees)
        {
            Employee.Number = _numberSequenceService.GenerateNumber(nameof(Employee), "", "CST");
            Employee.DepartmentId = GetRandomValue(departments, random);
            Employee.City = GetRandomString(cities, random);
            Employee.Street = GetRandomString(streets, random);
            Employee.State = GetRandomString(states, random);
            Employee.ZipCode = GetRandomString(zipCodes, random);
            Employee.PhoneNumber = GetRandomString(phoneNumbers, random);
            Employee.EmailAddress = $"{Employee.Name?.Split(' ')[0].ToLower()}@{GetRandomString(emailDomains, random)}";

            await _EmployeeRepository.CreateAsync(Employee);
        }

        await _unitOfWork.SaveAsync();
    }

    private static T GetRandomValue<T>(T[] array, Random random)
    {
        return array[random.Next(array.Length)];
    }

    private static string GetRandomString(string[] array, Random random)
    {
        return array[random.Next(array.Length)];
    }
}
