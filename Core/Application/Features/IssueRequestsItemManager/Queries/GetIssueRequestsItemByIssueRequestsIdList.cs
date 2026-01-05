using Application.Common.CQS.Queries;
using Application.Common.Extensions;
using AutoMapper;
using Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.IssueRequestsItemManager.Queries;

public record GetIssueRequestsItemByIssueRequestsIdListDto
{
    public string? Id { get; init; }
    public string? IssueRequestsId { get; init; }
    public string? IssueRequestsNumber { get; init; }
    public string? ProductId { get; init; }
    public string? ProductName { get; init; }
    public string? ProductNumber { get; init; }
    public string? Summary { get; init; }
    public double? UnitPrice { get; init; }
    public string? WarehouseId { get; init; }

    public double? AvailableQuantity { get; init; }
    public double? RequestedQuantity { get; set; } 
    public double? SuppliedQuantity { get; set; } 
    public double? Total { get; init; }
    public DateTime? CreatedAtUtc { get; init; }
}

public class GetIssueRequestsItemByIssueRequestsIdListProfile : Profile
{
    public GetIssueRequestsItemByIssueRequestsIdListProfile()
    {
        CreateMap<IssueRequestsItem, GetIssueRequestsItemByIssueRequestsIdListDto>()
            .ForMember(
                dest => dest.IssueRequestsNumber,
                opt => opt.MapFrom(src => src.IssueRequests != null ? src.IssueRequests.Number : string.Empty)
            )
            .ForMember(
                dest => dest.ProductName,
                opt => opt.MapFrom(src => src.Product != null ? src.Product.Name : string.Empty)
            )
            .ForMember(
                dest => dest.ProductNumber,
                opt => opt.MapFrom(src => src.Product != null ? src.Product.Number : string.Empty)
            );

    }
}

public class GetIssueRequestsItemByIssueRequestsIdListResult
{
    public List<GetIssueRequestsItemByIssueRequestsIdListDto>? Data { get; init; }
}

public class GetIssueRequestsItemByIssueRequestsIdListRequest : IRequest<GetIssueRequestsItemByIssueRequestsIdListResult>
{
    public string? IssueRequestsId { get; init; }
}


public class GetIssueRequestsItemByIssueRequestsIdListHandler : IRequestHandler<GetIssueRequestsItemByIssueRequestsIdListRequest, GetIssueRequestsItemByIssueRequestsIdListResult>
{
    private readonly IMapper _mapper;
    private readonly IQueryContext _context;

    public GetIssueRequestsItemByIssueRequestsIdListHandler(IMapper mapper, IQueryContext context)
    {
        _mapper = mapper;
        _context = context;
    }

    public async Task<GetIssueRequestsItemByIssueRequestsIdListResult> Handle(GetIssueRequestsItemByIssueRequestsIdListRequest request, CancellationToken cancellationToken)
    {
        var query = _context
            .IssueRequestsItem
            .AsNoTracking()
            .ApplyIsDeletedFilter(false)
            .Include(x => x.IssueRequests)
            .Include(x => x.Product)/*.ThenInclude(p => p!.InventoryTransactions)*/
            .Where(x => x.IssueRequestsId == request.IssueRequestsId)
            .AsQueryable();

        var entities = await query.ToListAsync(cancellationToken);

        var dtos = _mapper.Map<List<GetIssueRequestsItemByIssueRequestsIdListDto>>(entities);

        return new GetIssueRequestsItemByIssueRequestsIdListResult
        {
            Data = dtos
        };
    }


}



