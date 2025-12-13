using Application.Common.Repositories;
using Application.Features.NumberSequenceManager;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.SeedManager.Demos;

public class CustomerSeeder
{
    private readonly ICommandRepository<Customer> _customerRepository;
    private readonly ICommandRepository<CustomerGroup> _groupRepository;
    private readonly ICommandRepository<CustomerCategory> _categoryRepository;
    private readonly NumberSequenceService _numberSequenceService;
    private readonly IUnitOfWork _unitOfWork;

    public CustomerSeeder(
        ICommandRepository<Customer> customerRepository,
        ICommandRepository<CustomerGroup> groupRepository,
        ICommandRepository<CustomerCategory> categoryRepository,
        NumberSequenceService numberSequenceService,
        IUnitOfWork unitOfWork
    )
    {
        _customerRepository = customerRepository;
        _groupRepository = groupRepository;
        _categoryRepository = categoryRepository;
        _numberSequenceService = numberSequenceService;
        _unitOfWork = unitOfWork;
    }

    public async Task GenerateDataAsync()
    {
        var groups = (await _groupRepository.GetQuery().ToListAsync()).Select(x => x.Id).ToArray();
		var categories = (await _categoryRepository.GetQuery().ToListAsync()).Select(x => x.Id).ToArray();

		var cities = new string[] { "القاهرة", "الإسكندرية", "الجيزة", "المنصورة" };
		var streets = new string[] { "شارع التحرير", "شارع الجمهورية", "شارع سعد زغلول", "شارع عبد الرحمن حسن" };
		var states = new string[] { "القاهرة", "الإسكندرية", "الجيزة", "الدقهلية" };
		var zipCodes = new string[] { "11511", "21511", "12511", "34511" };
		var phoneNumbers = new string[] { "02-12345678", "03-87654321", "02-56781234", "050-4321876" };

		var emailDomains = new string[] { "example.com", "demo.com", "test.com", "sample.com" };

        var random = new Random();

        var customers = new List<Customer>
        {
new Customer { Name = "العميل 1" },
new Customer { Name = "العميل 2" },
new Customer { Name = "العميل 3" },
new Customer { Name = "العميل 4" },
new Customer { Name = "العميل 5" },
new Customer { Name = "العميل 6" },
new Customer { Name = "العميل 7" },
new Customer { Name = "العميل 8" },
new Customer { Name = "العميل 9" },
new Customer { Name = "العميل 10" },
new Customer { Name = "العميل 11" },
new Customer { Name = "العميل 12" },
new Customer { Name = "العميل 13" },
new Customer { Name = "العميل 14" },
new Customer { Name = "العميل 15" },
new Customer { Name = "العميل 16" },
new Customer { Name = "العميل 17" },
new Customer { Name = "العميل 18" },
new Customer { Name = "العميل 19" },
new Customer { Name = "العميل 20" },
new Customer { Name = "العميل 21" }

		};

        foreach (var customer in customers)
        {
            customer.Number = _numberSequenceService.GenerateNumber(nameof(Customer), "", "CST");
            customer.CustomerGroupId = GetRandomValue(groups, random);
            customer.CustomerCategoryId = GetRandomValue(categories, random);
            customer.City = GetRandomString(cities, random);
            customer.Street = GetRandomString(streets, random);
            customer.State = GetRandomString(states, random);
            customer.ZipCode = GetRandomString(zipCodes, random);
            customer.PhoneNumber = GetRandomString(phoneNumbers, random);
            customer.EmailAddress = $"{customer.Name?.Split(' ')[0].ToLower()}@{GetRandomString(emailDomains, random)}";

            await _customerRepository.CreateAsync(customer);
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
