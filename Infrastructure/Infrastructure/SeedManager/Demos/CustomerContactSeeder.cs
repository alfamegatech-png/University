using Application.Common.Repositories;
using Application.Features.NumberSequenceManager;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.SeedManager.Demos;

public class CustomerContactSeeder
{
    private readonly ICommandRepository<CustomerContact> _customerContactRepository;
    private readonly ICommandRepository<Customer> _customerRepository;
    private readonly NumberSequenceService _numberSequenceService;
    private readonly IUnitOfWork _unitOfWork;

    public CustomerContactSeeder(
        ICommandRepository<CustomerContact> customerContactRepository,
        ICommandRepository<Customer> customerRepository,
        NumberSequenceService numberSequenceService,
        IUnitOfWork unitOfWork
    )
    {
        _customerContactRepository = customerContactRepository;
        _customerRepository = customerRepository;
        _numberSequenceService = numberSequenceService;
        _unitOfWork = unitOfWork;
    }

    public async Task GenerateDataAsync()
    {
		var firstNames = new string[]
		{
	"Ahmed", "Sara", "Mohamed", "Fatma", "Ali", "Mona",
	"Karim", "Hana", "Yasser", "Hala", "Mahmoud", "Dina",
	"Tarek", "Leila", "Omar", "Amal", "Youssef",
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
	"الرئيس التنفيذي",           // Chief Executive Officer
    "عالم بيانات",               // Data Scientist
    "مدير المنتج",               // Product Manager
    "مدير تطوير الأعمال",        // Business Development Executive
    "استشاري تكنولوجيا المعلومات", // IT Consultant
    "أخصائي وسائل التواصل الاجتماعي", // Social Media Specialist
    "محلل أبحاث",                // Research Analyst
    "كاتب محتوى",               // Content Writer
    "مدير العمليات",            // Operations Manager
    "مخطط مالي",               // Financial Planner
    "مطور برمجيات",             // Software Developer
    "مدير نجاح العملاء",         // Customer Success Manager
    "منسق تسويق",               // Marketing Coordinator
    "مختبر ضمان الجودة",         // Quality Assurance Tester
    "أخصائي موارد بشرية",        // HR Specialist
    "منسق فعاليات",             // Event Coordinator
    "مدير حسابات",              // Account Executive
    "مسؤول الشبكات",            // Network Administrator
    "مدير المبيعات",            // Sales Manager
    "مساعد قانوني"              // Legal Assistant
		};

		var customerIds = await _customerRepository.GetQuery().Select(x => x.Id).ToListAsync();
        var random = new Random();

        var customerContacts = new List<CustomerContact>();

        foreach (var customerId in customerIds)
        {
            for (int i = 0; i < 3; i++)
            {
                var firstName = GetRandomString(firstNames, random);
                var lastName = GetRandomString(lastNames, random);

                customerContacts.Add(new CustomerContact
                {
                    Name = $"{firstName} {lastName}",
                    Number = _numberSequenceService.GenerateNumber(nameof(CustomerContact), "", "CC"),
                    CustomerId = customerId,
                    JobTitle = GetRandomString(jobTitles, random),
                    EmailAddress = $"{firstName.ToLower()}.{lastName.ToLower()}@gmail.com",
                    PhoneNumber = GenerateRandomPhoneNumber(random)
                });
            }
        }

        foreach (var contact in customerContacts)
        {
            await _customerContactRepository.CreateAsync(contact);
        }

        await _unitOfWork.SaveAsync();
    }

    private static string GetRandomString(string[] array, Random random)
    {
        return array[random.Next(array.Length)];
    }

    private static string GenerateRandomPhoneNumber(Random random)
    {
        return $"+1-{random.Next(100, 999)}-{random.Next(100, 999)}-{random.Next(1000, 9999)}";
    }
}
