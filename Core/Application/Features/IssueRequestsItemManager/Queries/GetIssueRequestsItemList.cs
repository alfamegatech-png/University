using Application.Common.CQS.Queries;
using Application.Common.Extensions;
using AutoMapper;
using Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.IssueRequestsItemManager.Queries;

public record GetIssueRequestsItemListDto
{
    public string? Id { get; init; }
    public string? IssueRequestsId { get; init; }
    public string? IssueRequestsNumber { get; init; }
    public string? CustomerName { get; init; }
    public string? ProductId { get; init; }
    public string? ProductName { get; init; }
    public string? ProductNumber { get; init; }
    public string? Summary { get; init; }
    public double? UnitPrice { get; init; }
    public double? Quantity { get; init; }
    public double? Total { get; init; }
    public DateTime? CreatedAtUtc { get; init; }
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
                dest => dest.CustomerName,
                opt => opt.MapFrom(src => src.IssueRequests!.Employee != null ? src.IssueRequests.Employee.Name : string.Empty)
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
        var query = _context
            .IssueRequestsItem
            .AsNoTracking()
            .ApplyIsDeletedFilter(request.IsDeleted)
            .Include(x => x.IssueRequests)
                .ThenInclude(x => x!.Employee)
            .Include(x => x.Product)
            .AsQueryable();

        var entities = await query.ToListAsync(cancellationToken);

        var dtos = _mapper.Map<List<GetIssueRequestsItemListDto>>(entities);

        return new GetIssueRequestsItemListResult
        {
            Data = dtos
        };
    }


}



