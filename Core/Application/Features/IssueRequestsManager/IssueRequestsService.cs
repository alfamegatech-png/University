using Application.Common.Extensions;
using Application.Common.Repositories;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.IssueRequestsManager;

public class IssueRequestsService
{
    private readonly ICommandRepository<IssueRequests> _IssueRequestsRepository;
    private readonly ICommandRepository<IssueRequestsItem> _IssueRequestsItemRepository;
    private readonly IUnitOfWork _unitOfWork;

    public IssueRequestsService(
        ICommandRepository<IssueRequests> IssueRequestsRepository,
        ICommandRepository<IssueRequestsItem> IssueRequestsItemRepository,
        IUnitOfWork unitOfWork
        )
    {
        _IssueRequestsRepository = IssueRequestsRepository;
        _IssueRequestsItemRepository = IssueRequestsItemRepository;
        _unitOfWork = unitOfWork;
    }

    public void Recalculate(string IssueRequestsId)
    {
        var IssueRequests = _IssueRequestsRepository
            .GetQuery()
            .ApplyIsDeletedFilter()
            .Where(x => x.Id == IssueRequestsId)
            .Include(x => x.Tax)
            .SingleOrDefault();

        if (IssueRequests == null)
            return;

        var IssueRequestsItems = _IssueRequestsItemRepository
            .GetQuery()
            .ApplyIsDeletedFilter()
            .Where(x => x.IssueRequestsId == IssueRequestsId)
            .ToList();

        IssueRequests.BeforeTaxAmount = IssueRequestsItems.Sum(x => x.Total ?? 0);
   

        var taxPercentage = IssueRequests.Tax?.Percentage ?? 0;
         IssueRequests.TaxAmount = (IssueRequests.BeforeTaxAmount ?? 0) * taxPercentage / 100;

        IssueRequests.AfterTaxAmount = (IssueRequests.BeforeTaxAmount ?? 0) + (IssueRequests.TaxAmount ?? 0);


        _IssueRequestsRepository.Update(IssueRequests);
        _unitOfWork.Save();
    }
}
