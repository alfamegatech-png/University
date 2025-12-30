using Application.Common.CQS.Queries;
using Application.Common.Extensions;
using AutoMapper;
using Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.DepartmentManager.Queries;

public record GetDepartmentListDto
{
    public string? Id { get; init; }
    public string? Name { get; set; }
    public string? Description { get; set; }
    public string? CreatedById { get; init; }
    public DateTime? CreatedAtUtc { get; init; }
}

public class GetDepartmentListProfile : Profile
{
    public GetDepartmentListProfile()
    {
        CreateMap<Department, GetDepartmentListDto>();
      

    }
}

public class GetDepartmentListResult
{
    public List<GetDepartmentListDto>? Data { get; init; }
}

public class GetDepartmentListRequest : IRequest<GetDepartmentListResult>
{
    public bool IsDeleted { get; init; } = false;
}


public class GetDepartmentListHandler : IRequestHandler<GetDepartmentListRequest, GetDepartmentListResult>
{
    private readonly IMapper _mapper;
    private readonly IQueryContext _context;

    public GetDepartmentListHandler(IMapper mapper, IQueryContext context)
    {
        _mapper = mapper;
        _context = context;
    }

    public async Task<GetDepartmentListResult> Handle(GetDepartmentListRequest request, CancellationToken cancellationToken)
    {
        var query = _context
            .Departments
            .AsNoTracking()
            .ApplyIsDeletedFilter(request.IsDeleted)
    
            .AsQueryable();

        var entities = await query.ToListAsync(cancellationToken);

        var dtos = _mapper.Map<List<GetDepartmentListDto>>(entities);

        return new GetDepartmentListResult
        {
            Data = dtos
        };
    }


}



