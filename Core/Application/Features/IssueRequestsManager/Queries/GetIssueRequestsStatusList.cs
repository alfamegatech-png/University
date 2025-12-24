using Application.Common.Extensions;
using AutoMapper;
using Domain.Enums;
using MediatR;

namespace Application.Features.IssueRequestsManager.Queries;

public record GetIssueRequestsStatusListDto
{
    public string? Id { get; init; }
    public string? Name { get; init; }
}

public class GetIssueRequestsStatusListProfile : Profile
{
    public GetIssueRequestsStatusListProfile()
    {
    }
}

public class GetIssueRequestsStatusListResult
{
    public List<GetIssueRequestsStatusListDto>? Data { get; init; }
}

public class GetIssueRequestsStatusListRequest : IRequest<GetIssueRequestsStatusListResult>
{
}


public class GetIssueRequestsStatusListHandler : IRequestHandler<GetIssueRequestsStatusListRequest, GetIssueRequestsStatusListResult>
{

    public GetIssueRequestsStatusListHandler()
    {
    }

    public async Task<GetIssueRequestsStatusListResult> Handle(GetIssueRequestsStatusListRequest request, CancellationToken cancellationToken)
    {
        var statuses = Enum.GetValues(typeof(IssueRequestsStatus))
            .Cast<IssueRequestsStatus>()
            .Select(status => new GetIssueRequestsStatusListDto
            {
                Id = ((int)status).ToString(),
                Name = status.ToFriendlyName()
            })
            .ToList();

        await Task.CompletedTask;

        return new GetIssueRequestsStatusListResult
        {
            Data = statuses
        };
    }


}



