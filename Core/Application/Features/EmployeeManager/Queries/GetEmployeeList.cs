using Application.Common.CQS.Queries;
using Application.Common.Extensions;
using AutoMapper;
using Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.EmployeeManager.Queries;

public record GetEmployeeListDto
{
    public string? Id { get; init; }
    public string? Name { get; set; }
    public string? Number { get; set; }
    public string? Description { get; set; }
    public string? Street { get; set; }
    public string? City { get; set; }
    public string? State { get; set; }
    public string? ZipCode { get; set; }
    public string? Country { get; set; }
    public string? PhoneNumber { get; set; }
    public string? FaxNumber { get; set; }
    public string? EmailAddress { get; set; }
    public string? Website { get; set; }
    public string? WhatsApp { get; set; }
    public string? LinkedIn { get; set; }
    public string? Facebook { get; set; }
    public string? Instagram { get; set; }
    public string? TwitterX { get; set; }
    public string? TikTok { get; set; }

    public string? CreatedById { get; init; }
    public DateTime? CreatedAtUtc { get; init; }
}

public class GetEmployeeListProfile : Profile
{
    public GetEmployeeListProfile()
    {
        CreateMap<Employee, GetEmployeeListDto>();
            //.ForMember(
            //    dest => dest.EmployeeGroupName,
            //    opt => opt.MapFrom(src => src.EmployeeGroup != null ? src.EmployeeGroup.Name : string.Empty)
            //)
            //.ForMember(
            //    dest => dest.EmployeeCategoryName,
            //    opt => opt.MapFrom(src => src.EmployeeCategory != null ? src.EmployeeCategory.Name : string.Empty)
            //);

    }
}

public class GetEmployeeListResult
{
    public List<GetEmployeeListDto>? Data { get; init; }
}

public class GetEmployeeListRequest : IRequest<GetEmployeeListResult>
{
    public bool IsDeleted { get; init; } = false;
}


public class GetEmployeeListHandler : IRequestHandler<GetEmployeeListRequest, GetEmployeeListResult>
{
    private readonly IMapper _mapper;
    private readonly IQueryContext _context;

    public GetEmployeeListHandler(IMapper mapper, IQueryContext context)
    {
        _mapper = mapper;
        _context = context;
    }

    public async Task<GetEmployeeListResult> Handle(GetEmployeeListRequest request, CancellationToken cancellationToken)
    {
        var query = _context
            .Employee
            .AsNoTracking()
            .ApplyIsDeletedFilter(request.IsDeleted)
            //.Include(x => x.EmployeeGroup)
            //.Include(x => x.EmployeeCategory)
            .AsQueryable();

        var entities = await query.ToListAsync(cancellationToken);

        var dtos = _mapper.Map<List<GetEmployeeListDto>>(entities);

        return new GetEmployeeListResult
        {
            Data = dtos
        };
    }


}



