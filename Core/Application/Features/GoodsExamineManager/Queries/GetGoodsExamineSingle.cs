using Application.Common.CQS.Queries;
using Application.Common.Extensions;
using AutoMapper;
using Domain.Entities;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.GoodsExamineManager.Queries;


public class GetGoodsExamineSingleProfile : Profile
{
    public GetGoodsExamineSingleProfile()
    {
    }
}

public class GetGoodsExamineSingleResult
{
    public GoodsExamine? Data { get; init; }
    public List<InventoryTransaction>? TransactionList { get; init; }
}

public class GetGoodsExamineSingleRequest : IRequest<GetGoodsExamineSingleResult>
{
    public string? Id { get; init; }
}

public class GetGoodsExamineSingleValidator : AbstractValidator<GetGoodsExamineSingleRequest>
{
    public GetGoodsExamineSingleValidator()
    {
        RuleFor(x => x.Id).NotEmpty();
    }
}

public class GetGoodsExamineSingleHandler : IRequestHandler<GetGoodsExamineSingleRequest, GetGoodsExamineSingleResult>
{
    private readonly IQueryContext _context;

    public GetGoodsExamineSingleHandler(
        IQueryContext context
        )
    {
        _context = context;
    }

    public async Task<GetGoodsExamineSingleResult> Handle(GetGoodsExamineSingleRequest request, CancellationToken cancellationToken)
    {
        var queryData = _context
            .GoodsExamine
            .AsNoTracking()
            .Include(x => x.PurchaseOrder)
                .ThenInclude(x => x.Vendor)
            .Where(x => x.Id == request.Id)
            .AsQueryable();

        var data = await queryData.SingleOrDefaultAsync(cancellationToken);


        var queryTransactionList = _context
            .InventoryTransaction
            .AsNoTracking()
            .ApplyIsDeletedFilter(false)
            .Include(x => x.Product)
            .Include(x => x.Warehouse)
            .Include(x => x.WarehouseFrom)
            .Include(x => x.WarehouseTo)
            .Where(x => x.ModuleId == request.Id && x.ModuleName == nameof(GoodsExamine))
            .AsQueryable();

        var transactionList = await queryTransactionList.ToListAsync(cancellationToken);

        return new GetGoodsExamineSingleResult
        {
            Data = data,
            TransactionList = transactionList
        };
    }
}