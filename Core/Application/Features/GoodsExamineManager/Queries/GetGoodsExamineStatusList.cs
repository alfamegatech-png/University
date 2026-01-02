using Application.Common.Extensions;
using AutoMapper;
using Domain.Enums;
using MediatR;

namespace Application.Features.GoodsExamineManager.Queries;

public record GetGoodsExamineStatusListDto
{
    public string? Id { get; init; }
    public string? Name { get; init; }
}

public class GetGoodsExamineStatusListProfile : Profile
{
    public GetGoodsExamineStatusListProfile()
    {
    }
}

public class GetGoodsExamineStatusListResult
{
    public List<GetGoodsExamineStatusListDto>? Data { get; init; }
}

public class GetGoodsExamineStatusListRequest : IRequest<GetGoodsExamineStatusListResult>
{
}


public class GetGoodsExamineStatusListHandler : IRequestHandler<GetGoodsExamineStatusListRequest, GetGoodsExamineStatusListResult>
{

    public GetGoodsExamineStatusListHandler()
    {
    }

    public async Task<GetGoodsExamineStatusListResult> Handle(GetGoodsExamineStatusListRequest request, CancellationToken cancellationToken)
    {
        var statuses = Enum.GetValues(typeof(GoodsExamineStatus))
            .Cast<GoodsExamineStatus>()
            .Select(status => new GetGoodsExamineStatusListDto
            {
                Id = ((int)status).ToString(),
                Name = status.ToFriendlyName()
            })
            .ToList();

        await Task.CompletedTask;

        return new GetGoodsExamineStatusListResult
        {
            Data = statuses
        };
    }


}



