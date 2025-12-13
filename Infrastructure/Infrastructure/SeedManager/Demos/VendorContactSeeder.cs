using Application.Common.Repositories;
using Application.Features.NumberSequenceManager;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.SeedManager.Demos;

public class VendorContactSeeder
{
    private readonly ICommandRepository<VendorContact> _vendorContactRepository;
    private readonly ICommandRepository<Vendor> _vendorRepository;
    private readonly NumberSequenceService _numberSequenceService;
    private readonly IUnitOfWork _unitOfWork;

    public VendorContactSeeder(
        ICommandRepository<VendorContact> vendorContactRepository,
        ICommandRepository<Vendor> vendorRepository,
        NumberSequenceService numberSequenceService,
        IUnitOfWork unitOfWork
    )
    {
        _vendorContactRepository = vendorContactRepository;
        _vendorRepository = vendorRepository;
        _numberSequenceService = numberSequenceService;
        _unitOfWork = unitOfWork;
    }

    public async Task GenerateDataAsync()
    {
		var firstNames = new string[]
		{
	"Ahmed", "Sara", "Mohamed", "Fatma", "Ali", "Mona",
	"Karim", "Hana", "Yasser", "Hala", "Mahmoud", "Dina",
	"Tarek", "Laila", "Omar", "Amal", "Youssef",
	"Salma", "Omar", "Noor"
		};

		var lastNames = new string[]
		{
	"Mohamed", "Ahmed", "Ali", "Hassan", "Abdallah", "Mostafa",
	"Youssef", "Saeed", "Hassan", "Mahmoud", "Salah", "Khaled",
	"Tarek", "Samir", "Fouad", "Ibrahim", "Hassan", "Sherif",
	"Mina", "Ramy"
		};


		var jobTitles = new string[]
		{
	"المدير التنفيذي", "عالم بيانات", "مدير منتج", "مدير تطوير الأعمال",
	"استشاري تكنولوجيا المعلومات", "أخصائي وسائل التواصل الاجتماعي", "محلل أبحاث", "كاتب محتوى",
	"مدير العمليات", "مخطط مالي", "مطور برمجيات", "مدير نجاح الموردين",
	"منسق تسويق", "مختبر ضمان الجودة", "أخصائي الموارد البشرية", "منسق فعاليات",
	"مدير حسابات", "مسؤول الشبكات", "مدير مبيعات", "مساعد قانوني"
		};


		var vendorIds = await _vendorRepository.GetQuery().Select(x => x.Id).ToListAsync();
        var random = new Random();

        var vendorContacts = new List<VendorContact>();

        foreach (var vendorId in vendorIds)
        {
            for (int i = 0; i < 3; i++)
            {
                var firstName = GetRandomString(firstNames, random);
                var lastName = GetRandomString(lastNames, random);

                vendorContacts.Add(new VendorContact
                {
                    Name = $"{firstName} {lastName}",
                    Number = _numberSequenceService.GenerateNumber(nameof(VendorContact), "", "VC"),
                    VendorId = vendorId,
                    JobTitle = GetRandomString(jobTitles, random),
                    EmailAddress = $"{firstName.ToLower()}.{lastName.ToLower()}@gmail.com",
                    PhoneNumber = $"+1-{random.Next(100, 999)}-{random.Next(100, 999)}-{random.Next(1000, 9999)}"
                });
            }
        }

        foreach (var contact in vendorContacts)
        {
            await _vendorContactRepository.CreateAsync(contact);
        }

        await _unitOfWork.SaveAsync();
    }

    private static string GetRandomString(string[] array, Random random)
    {
        return array[random.Next(array.Length)];
    }
}
