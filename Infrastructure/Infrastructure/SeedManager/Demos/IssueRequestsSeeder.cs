using Application.Common.Repositories;
using Application.Features.NumberSequenceManager;
using Application.Features.IssueRequestsManager;
using Domain.Entities;
using Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.SeedManager.Demos;

public class IssueRequestsSeeder
{
    private readonly IssueRequestsService _IssueRequestsService;
    private readonly ICommandRepository<IssueRequests> _IssueRequestsRepository;
    private readonly ICommandRepository<IssueRequestsItem> _IssueRequestsItemRepository;
    private readonly ICommandRepository<Employee> _EmployeeRepository;
    private readonly ICommandRepository<Tax> _taxRepository;
    private readonly ICommandRepository<Product> _productRepository;
    private readonly NumberSequenceService _numberSequenceService;
    private readonly IUnitOfWork _unitOfWork;

    public IssueRequestsSeeder(
        IssueRequestsService IssueRequestsService,
        ICommandRepository<IssueRequests> IssueRequestsRepository,
        ICommandRepository<IssueRequestsItem> IssueRequestsItemRepository,
        ICommandRepository<Employee> EmployeeRepository,
        ICommandRepository<Tax> taxRepository,
        ICommandRepository<Product> productRepository,
        NumberSequenceService numberSequenceService,
        IUnitOfWork unitOfWork
    )
    {
        _IssueRequestsService = IssueRequestsService;
        _IssueRequestsRepository = IssueRequestsRepository;
        _IssueRequestsItemRepository = IssueRequestsItemRepository;
        _EmployeeRepository = EmployeeRepository;
        _taxRepository = taxRepository;
        _productRepository = productRepository;
        _numberSequenceService = numberSequenceService;
        _unitOfWork = unitOfWork;
    }

    public async Task GenerateDataAsync()
    {
        var random = new Random();
        var Employees = await _EmployeeRepository.GetQuery().Select(x => x.Id).ToListAsync();
        var taxes = await _taxRepository.GetQuery().Select(x => x.Id).ToListAsync();
        var products = await _productRepository.GetQuery().ToListAsync();

        var dateFinish = DateTime.Now;
        var dateStart = new DateTime(dateFinish.AddMonths(-12).Year, dateFinish.AddMonths(-12).Month, 1);

        for (DateTime date = dateStart; date < dateFinish; date = date.AddMonths(1))
        {
            DateTime[] transactionDates = GetRandomDays(date.Year, date.Month, 6);

            foreach (DateTime transDate in transactionDates)
            {
                var issueRequests = new IssueRequests
                {
                    Number = _numberSequenceService.GenerateNumber(nameof(IssueRequests), "", "SO"),
                    OrderDate = transDate,
                    OrderStatus = (SalesOrderStatus)random.Next(0, Enum.GetNames(typeof(SalesOrderStatus)).Length),
                    EmployeeId = GetRandomValue(Employees, random),
                    TaxId = taxes.Any() ? GetRandomValue(taxes, random) : null
                    //TaxId = GetRandomValue(taxes, random),
                };
                await _IssueRequestsRepository.CreateAsync(issueRequests);

                int numberOfProducts = random.Next(3, 6);
                for (int i = 0; i < numberOfProducts; i++)
                {
                    var qty = random.Next(2, 5);
                    var product = products[random.Next(products.Count)];
                    var IssueRequestsItem = new IssueRequestsItem
                    {
                        IssueRequestsId = issueRequests.Id,
                        ProductId = product.Id,
                        Summary = product.Number,
                        UnitPrice = product.UnitPrice,
                        SuppliedQuantity = qty,
                        Total = product.UnitPrice * qty
                    };
                    await _IssueRequestsItemRepository.CreateAsync(IssueRequestsItem);
                }

                await _unitOfWork.SaveAsync();

                _IssueRequestsService.Recalculate(issueRequests.Id);
            }
        }

    }

    private static T GetRandomValue<T>(List<T> list, Random random)
    {
        return list[random.Next(list.Count)];
    }

    private static DateTime[] GetRandomDays(int year, int month, int count)
    {
        var random = new Random();
        var daysInMonth = Enumerable.Range(1, DateTime.DaysInMonth(year, month)).ToList();
        var selectedDays = new List<int>();

        for (int i = 0; i < count; i++)
        {
            int day = daysInMonth[random.Next(daysInMonth.Count)];
            selectedDays.Add(day);
            daysInMonth.Remove(day);
        }

        return selectedDays.Select(day => new DateTime(year, month, day)).ToArray();
    }
}
