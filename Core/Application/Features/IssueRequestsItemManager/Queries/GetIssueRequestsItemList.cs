using Application.Common.CQS.Queries;
using Application.Common.Extensions;
using AutoMapper;
using Domain.Entities;
using Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.IssueRequestsItemManager.Queries;

public record GetIssueRequestsItemListDto
{
    public string? Id { get; init; }
    public string? IssueRequestsId { get; init; }
    public string? IssueRequestsNumber { get; init; }
    public string? EmployeeName { get; init; }
    public string? ProductId { get; init; }
    public string? ProductName { get; init; }
    public string? ProductNumber { get; init; }
    public string? Summary { get; init; }
    public double? UnitPrice { get; init; }
    public double? AvailableQuantity { get; init; }
    public double? RequestedQuantity { get; set; } 
    public double? SuppliedQuantity { get; set; } 
    public double? Total { get; init; }
    public DateTime? CreatedAtUtc { get; init; }
    public List<InventoryTransaction>? InventoryTransactions { get; set; }
    public ProductStockSummaryDto? Stock { get; init; }
}
public record ProductStockSummaryDto
{
    public double TotalIn { get; init; }
    public double TotalOut { get; init; }
    public double CurrentStock => TotalIn - TotalOut;
}

public class GetIssueRequestsItemListProfile : Profile
{
    public GetIssueRequestsItemListProfile()
    {
        CreateMap<IssueRequestsItem, GetIssueRequestsItemListDto>()
            .ForMember(
                dest => dest.IssueRequestsNumber,
                opt => opt.MapFrom(src => src.IssueRequests != null ? src.IssueRequests.Number : string.Empty)
            )
            .ForMember(
                dest => dest.EmployeeName,
                opt => opt.MapFrom(src => src.IssueRequests!.Employee != null ? src.IssueRequests.Employee.Name : string.Empty)
            )
            .ForMember(
                dest => dest.ProductName,
                opt => opt.MapFrom(src => src.Product != null ? src.Product.Name : string.Empty)
            )
            .ForMember(
                dest => dest.ProductNumber,
                opt => opt.MapFrom(src => src.Product != null ? src.Product.Number : string.Empty)
            );//.ForMember(dest => dest.InventoryTransactions,
                //opt => opt.MapFrom(src => src.Product!.InventoryTransactions));

    }
}

public class GetIssueRequestsItemListResult
{
    public List<GetIssueRequestsItemListDto>? Data { get; init; }
}

public class GetIssueRequestsItemListRequest : IRequest<GetIssueRequestsItemListResult>
{
    public bool IsDeleted { get; init; } = false;
}

public class GetIssueRequestsItemListHandler : IRequestHandler<GetIssueRequestsItemListRequest, GetIssueRequestsItemListResult>
{
    private readonly IMapper _mapper;
    private readonly IQueryContext _context;

    public GetIssueRequestsItemListHandler(IMapper mapper, IQueryContext context)
    {
        _mapper = mapper;
        _context = context;
    }

    public async Task<GetIssueRequestsItemListResult> Handle(GetIssueRequestsItemListRequest request, CancellationToken cancellationToken)
    {
        // Step 1: Load all IssueRequestsItem with Product and IssueRequests/Employee
        var items = await _context.IssueRequestsItem
            .AsNoTracking()
            .ApplyIsDeletedFilter(request.IsDeleted)
            .Include(x => x.IssueRequests)
                .ThenInclude(ir => ir.Employee)
            .Include(x => x.Product) // we only need the product basic info
            .ToListAsync(cancellationToken);

        // Step 2: Get all ProductIds in one query to avoid N+1
        var productIds = items.Select(i => i.ProductId).Distinct().ToList();

        // Step 3: Load all InventoryTransactions for these products
        var transactions = await _context.InventoryTransaction
            .Where(t => t.ProductId != null && productIds.Contains(t.ProductId))
            .ToListAsync(cancellationToken);

        // Step 4: Map to DTOs
        var data = items.Select(item =>
        {
            // Filter transactions for this product
            var productTransactions = transactions
                .Where(t => t.ProductId == item.ProductId)
                .ToList();

            return new GetIssueRequestsItemListDto
            {
                Id = item.Id,
                IssueRequestsId = item.IssueRequestsId,
                IssueRequestsNumber = item.IssueRequests?.Number,
                EmployeeName = item.IssueRequests?.Employee?.Name,
                ProductId = item.ProductId,
                ProductName = item.Product?.Name,
                ProductNumber = item.Product?.Number,
                Summary = item.Summary,
                UnitPrice = item.UnitPrice,
                RequestedQuantity = item.RequestedQuantity,
                SuppliedQuantity = item.SuppliedQuantity,
                Total = item.Total,
                CreatedAtUtc = item.CreatedAtUtc,

                // Assign transactions without modifying Product entity
                InventoryTransactions = productTransactions,

                Stock = new ProductStockSummaryDto
                {
                    TotalIn = productTransactions
                        .Where(t => t.TransType == InventoryTransType.In)
                        .Sum(t => t.Movement ?? 0),
                    TotalOut = productTransactions
                        .Where(t => t.TransType == InventoryTransType.Out)
                        .Sum(t => t.Movement ?? 0)
                }
            };
        }).ToList();

        return new GetIssueRequestsItemListResult
        {
            Data = data
        };
    }
}

//public class GetIssueRequestsItemListHandler : IRequestHandler<GetIssueRequestsItemListRequest, GetIssueRequestsItemListResult>
//{
//    private readonly IMapper _mapper;
//    private readonly IQueryContext _context;

//    public GetIssueRequestsItemListHandler(IMapper mapper, IQueryContext context)
//    {
//        _mapper = mapper;
//        _context = context;
//    }
//    public async Task<GetIssueRequestsItemListResult> Handle(GetIssueRequestsItemListRequest request,CancellationToken cancellationToken)
//    {
//        var data = await _context.IssueRequestsItem
//            .AsNoTracking()
//            .ApplyIsDeletedFilter(request.IsDeleted)
//            .Select(item => new GetIssueRequestsItemListDto
//            {
//                Id = item.Id,
//                IssueRequestsId = item.IssueRequestsId,
//                IssueRequestsNumber = item.IssueRequests!.Number,
//                EmployeeName = item.IssueRequests!.Employee!.Name,

//                ProductId = item.ProductId,
//                ProductName = item.Product!.Name,
//                ProductNumber = item.Product.Number,

//                Summary = item.Summary,
//                UnitPrice = item.UnitPrice,
//                RequestedQuantity = item.RequestedQuantity,
//                Total = item.Total,
//                CreatedAtUtc = item.CreatedAtUtc,

//                Stock = new ProductStockSummaryDto
//                {
//                    TotalIn = _context.InventoryTransaction
//                        .Where(t =>
//                            t.ProductId == item.ProductId &&
//                            t.TransType == InventoryTransType.In)
//                        .Sum(t => (double?)t.Movement) ?? 0,

//                    TotalOut = _context.InventoryTransaction
//                        .Where(t =>
//                            t.ProductId == item.ProductId &&
//                            t.TransType == InventoryTransType.Out)
//                        .Sum(t => (double?)t.Movement) ?? 0
//                }
//            })
//            .ToListAsync(cancellationToken);

//        return new GetIssueRequestsItemListResult
//        {
//            Data = data
//        };
//    }

//    //public async Task<GetIssueRequestsItemListResult> Handle(GetIssueRequestsItemListRequest request, CancellationToken cancellationToken)
//    //{
//    //    var query = _context
//    //        .IssueRequestsItem
//    //        .AsNoTracking()
//    //        .ApplyIsDeletedFilter(request.IsDeleted)
//    //        .Include(x => x.IssueRequests)
//    //            .ThenInclude(x => x!.Employee)
//    //        .Include(x => x.Product)
//    //        .AsQueryable();

//    //    var entities = await query.ToListAsync(cancellationToken);

//    //    var dtos = _mapper.Map<List<GetIssueRequestsItemListDto>>(entities);

//    //    return new GetIssueRequestsItemListResult
//    //    {
//    //        Data = dtos
//    //    };
//    //}


//}



