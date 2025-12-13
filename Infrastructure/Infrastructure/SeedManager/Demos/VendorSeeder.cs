using Application.Common.Repositories;
using Application.Features.NumberSequenceManager;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.SeedManager.Demos;

public class VendorSeeder
{
    private readonly ICommandRepository<Vendor> _vendorRepository;
    private readonly ICommandRepository<VendorGroup> _groupRepository;
    private readonly ICommandRepository<VendorCategory> _categoryRepository;
    private readonly NumberSequenceService _numberSequenceService;
    private readonly IUnitOfWork _unitOfWork;

    public VendorSeeder(
        ICommandRepository<Vendor> vendorRepository,
        ICommandRepository<VendorGroup> groupRepository,
        ICommandRepository<VendorCategory> categoryRepository,
        NumberSequenceService numberSequenceService,
        IUnitOfWork unitOfWork
    )
    {
        _vendorRepository = vendorRepository;
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

		var zipCodes = new string[] { "10001", "90001", "60601", "73301" };
        var phoneNumbers = new string[] { "123-456-7890", "987-654-3210", "555-123-4567", "111-222-3333" };
        var emails = new string[] { "vendor1@example.com", "vendor2@example.com", "vendor3@example.com", "vendor4@example.com" };

        var random = new Random();

        var vendors = new List<Vendor>
        {
		   new Vendor { Name = "المورد 1" },
new Vendor { Name = "المورد 2" },
new Vendor { Name = "المورد 3" },
new Vendor { Name = "المورد 4" },
new Vendor { Name = "المورد 5" },
new Vendor { Name = "المورد 6" },
new Vendor { Name = "المورد 7" },
new Vendor { Name = "المورد 8" },
new Vendor { Name = "المورد 9" },
new Vendor { Name = "المورد 10" },
new Vendor { Name = "المورد 11" },
new Vendor { Name = "المورد 12" },
new Vendor { Name = "المورد 13" },
new Vendor { Name = "المورد 14" },
new Vendor { Name = "المورد 15" },
new Vendor { Name = "المورد 16" },
new Vendor { Name = "المورد 17" },
new Vendor { Name = "المورد 18" },
new Vendor { Name = "المورد 19" },
new Vendor { Name = "المورد 20" }

		};

        foreach (var vendor in vendors)
        {
            vendor.Number = _numberSequenceService.GenerateNumber(nameof(Vendor), "", "VND");
            vendor.VendorGroupId = GetRandomValue(groups, random);
            vendor.VendorCategoryId = GetRandomValue(categories, random);
            vendor.City = GetRandomString(cities, random);
            vendor.Street = GetRandomString(streets, random);
            vendor.State = GetRandomString(states, random);
            vendor.ZipCode = GetRandomString(zipCodes, random);
            vendor.PhoneNumber = GetRandomString(phoneNumbers, random);
            vendor.EmailAddress = GetRandomString(emails, random);

            await _vendorRepository.CreateAsync(vendor);
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
