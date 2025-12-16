using Application.Common.CQS.Queries;
using Application.Common.Extensions;
using AutoMapper;
using Domain.Entities;
using Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.IssueRequestsManager.Queries;

public record GetIssueRequestsListDto
{
    public string? Id { get; init; }
    public string? Number { get; init; }
    public DateTime? OrderDate { get; init; }
    public IssueRequestsStatus? OrderStatus { get; init; }
    public string? OrderStatusName { get; init; }
    public string? Description { get; init; }
    public string? EmployeeId { get; init; }
    public string? CustomerName { get; init; }
    public string? TaxId { get; init; }
    public string? TaxName { get; init; }
    public double? BeforeTaxAmount { get; init; }
    public double? TaxAmount { get; init; }
    public double? AfterTaxAmount { get; init; }
    public DateTime? CreatedAtUtc { get; init; }
}

public class GetIssueRequestsListProfile : Profile
{
    public GetIssueRequestsListProfile()
    {
        CreateMap<IssueRequests, GetIssueRequestsListDto>()
            .ForMember(
                dest => dest.CustomerName,
                opt => opt.MapFrom(src => src.Employee != null ? src.Employee.Name : string.Empty)
            )
            .ForMember(
                dest => dest.TaxName,
                opt => opt.MapFrom(src => src.Tax != null ? src.Tax.Name : string.Empty)
            )
            .ForMember(
                dest => dest.OrderStatusName,
                opt => opt.MapFrom(src => src.OrderStatus.HasValue ? src.OrderStatus.Value.ToFriendlyName() : string.Empty)
            );

    }
}

public class GetIssueRequestsListResult
{
    public List<GetIssueRequestsListDto>? Data { get; init; }
}

public class GetIssueRequestsListRequest : IRequest<GetIssueRequestsListResult>
{
    public bool IsDeleted { get; init; } = false;
}


public class GetIssueRequestsListHandler : IRequestHandler<GetIssueRequestsListRequest, GetIssueRequestsListResult>
{
    private readonly IMapper _mapper;
    private readonly IQueryContext _context;

    public GetIssueRequestsListHandler(IMapper mapper, IQueryContext context)
    {
        _mapper = mapper;
        _context = context;
    }

    public async Task<GetIssueRequestsListResult> Handle(GetIssueRequestsListRequest request, CancellationToken cancellationToken)
    {
        var query = _context
            .IssueRequests
            .AsNoTracking()
            .ApplyIsDeletedFilter(request.IsDeleted)
            .Include(x => x.Employee)
            .Include(x => x.Tax)
            .AsQueryable();

        var entities = await query.ToListAsync(cancellationToken);

        var dtos = _mapper.Map<List<GetIssueRequestsListDto>>(entities);

        return new GetIssueRequestsListResult
        {
            Data = dtos
        };
    }


}



