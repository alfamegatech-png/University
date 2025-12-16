using Application.Common.CQS.Queries;
using AutoMapper;
using Domain.Entities;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.IssueRequestsManager.Queries;


public class GetIssueRequestsSingleProfile : Profile
{
    public GetIssueRequestsSingleProfile()
    {
    }
}

public class GetIssueRequestsSingleResult
{
    public IssueRequests? Data { get; init; }
}

public class GetIssueRequestsSingleRequest : IRequest<GetIssueRequestsSingleResult>
{
    public string? Id { get; init; }
}

public class GetIssueRequestsSingleValidator : AbstractValidator<GetIssueRequestsSingleRequest>
{
    public GetIssueRequestsSingleValidator()
    {
        RuleFor(x => x.Id).NotEmpty();
    }
}

public class GetIssueRequestsSingleHandler : IRequestHandler<GetIssueRequestsSingleRequest, GetIssueRequestsSingleResult>
{
    private readonly IQueryContext _context;

    public GetIssueRequestsSingleHandler(
        IQueryContext context
        )
    {
        _context = context;
    }

    public async Task<GetIssueRequestsSingleResult> Handle(GetIssueRequestsSingleRequest request, CancellationToken cancellationToken)
    {
        var query = _context
            .IssueRequests
            .AsNoTracking()
            .Include(x => x.Employee)
            .Include(x => x.Tax)
            .Include(x => x.IssueRequestsItemList.Where(item => !item.IsDeleted))
                .ThenInclude(x => x.Product)
            .Where(x => x.Id == request.Id)
            .AsQueryable();

        var entity = await query.SingleOrDefaultAsync(cancellationToken);

        return new GetIssueRequestsSingleResult
        {
            Data = entity
        };
    }
}