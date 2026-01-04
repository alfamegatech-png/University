using Application.Common.CQS.Queries;
using Application.Common.Extensions;
using Application.Features.IssueRequestsManager.Queries;
using AutoMapper;
using Domain.Entities;
using Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.IssueRequestsItemManager.Queries;

public record GetProductCurrentStockDto
{
    public string? ProductId { get; init; }
    public string? ProductName { get; init; }
    public string? ProductNumber { get; init; }
    public double? CurrentStock { get; init; }
}

public class GetProductCurrentStockResult
{
    public GetProductCurrentStockDto? Data { get; init; }
}
public class GetProductCurrentStockRequest : IRequest<GetProductCurrentStockResult>
{
    public string ProductId { get; init; } = null!;
    public string WarehouseId { get; init; } = null!;
    public bool IsDeleted { get; init; } = false;
}

public class GetProductCurrentStockHandler: IRequestHandler<GetProductCurrentStockRequest, GetProductCurrentStockResult>
{
    private readonly IQueryContext _context;

    public GetProductCurrentStockHandler(IQueryContext context)
    {
        _context = context;
    }

    public async Task<GetProductCurrentStockResult> Handle(GetProductCurrentStockRequest request,CancellationToken cancellationToken)
    {
        var query = _context.InventoryTransaction
            .AsNoTracking()
            .Where(x =>
                
            x.ProductId == request.ProductId &&
            x.WarehouseId == request.WarehouseId &&
                x.Status == InventoryTransactionStatus.Confirmed
            );
        var currentStock = await _context.InventoryTransaction
    .AsNoTracking()
    .Where(x =>
        x.ProductId == request.ProductId &&
        x.WarehouseId == request.WarehouseId &&
        //x.IsDeleted == false &&
        x.Status == InventoryTransactionStatus.Confirmed
    )
    .SumAsync(x => x.Stock, cancellationToken);


        //var currentStock = await query.SumAsync(
        //    x => x.Movement ?? 0,
        //    cancellationToken);

        var product = await _context.Product
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == request.ProductId, cancellationToken);

        return new GetProductCurrentStockResult
        {
            Data = new GetProductCurrentStockDto
            {
                ProductId = product?.Id,
                ProductName = product?.Name,
                ProductNumber = product?.Number,
                CurrentStock = currentStock
            }
        };
    }
}
