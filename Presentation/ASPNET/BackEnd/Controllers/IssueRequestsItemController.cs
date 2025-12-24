using Application.Features.IssueRequestsItemManager.Commands;
using Application.Features.IssueRequestsItemManager.Queries;
using ASPNET.BackEnd.Common.Base;
using ASPNET.BackEnd.Common.Models;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ASPNET.BackEnd.Controllers;

[Route("api/[controller]")]
public class IssueRequestsItemController : BaseApiController
{
    public IssueRequestsItemController(ISender sender) : base(sender)
    {
    }

    [Authorize]
    [HttpPost("CreateIssueRequestsItem")]
    public async Task<ActionResult<ApiSuccessResult<CreateIssueRequestsItemResult>>> CreateIssueRequestsItemAsync(CreateIssueRequestsItemRequest request, CancellationToken cancellationToken)
    {
        var response = await _sender.Send(request, cancellationToken);

        return Ok(new ApiSuccessResult<CreateIssueRequestsItemResult>
        {
            Code = StatusCodes.Status200OK,
            Message = $"Success executing {nameof(CreateIssueRequestsItemAsync)}",
            Content = response
        });
    }

    [Authorize]
    [HttpPost("UpdateIssueRequestsItem")]
    public async Task<ActionResult<ApiSuccessResult<UpdateIssueRequestsItemResult>>> UpdateIssueRequestsItemAsync(UpdateIssueRequestsItemRequest request, CancellationToken cancellationToken)
    {
        var response = await _sender.Send(request, cancellationToken);

        return Ok(new ApiSuccessResult<UpdateIssueRequestsItemResult>
        {
            Code = StatusCodes.Status200OK,
            Message = $"Success executing {nameof(UpdateIssueRequestsItemAsync)}",
            Content = response
        });
    }

    [Authorize]
    [HttpPost("DeleteIssueRequestsItem")]
    public async Task<ActionResult<ApiSuccessResult<DeleteIssueRequestsItemResult>>> DeleteIssueRequestsItemAsync(DeleteIssueRequestsItemRequest request, CancellationToken cancellationToken)
    {
        var response = await _sender.Send(request, cancellationToken);

        return Ok(new ApiSuccessResult<DeleteIssueRequestsItemResult>
        {
            Code = StatusCodes.Status200OK,
            Message = $"Success executing {nameof(DeleteIssueRequestsItemAsync)}",
            Content = response
        });
    }

    [Authorize]
    [HttpGet("GetIssueRequestsItemList")]
    public async Task<ActionResult<ApiSuccessResult<GetIssueRequestsItemListResult>>> GetIssueRequestsItemListAsync(
        CancellationToken cancellationToken,
        [FromQuery] bool isDeleted = false
        )
    {
        var request = new GetIssueRequestsItemListRequest { IsDeleted = isDeleted };
        var response = await _sender.Send(request, cancellationToken);

        return Ok(new ApiSuccessResult<GetIssueRequestsItemListResult>
        {
            Code = StatusCodes.Status200OK,
            Message = $"Success executing {nameof(GetIssueRequestsItemListAsync)}",
            Content = response
        });
    }

    [Authorize]
    [HttpGet("GetIssueRequestsItemByIssueRequestsIdList")]
    public async Task<ActionResult<ApiSuccessResult<GetIssueRequestsItemByIssueRequestsIdListResult>>> GetIssueRequestsItemByIssueRequestsIdListAsync(
    CancellationToken cancellationToken,
    [FromQuery] string IssueRequestsId
    )
    {
        var request = new GetIssueRequestsItemByIssueRequestsIdListRequest { IssueRequestsId = IssueRequestsId };
        var response = await _sender.Send(request, cancellationToken);

        return Ok(new ApiSuccessResult<GetIssueRequestsItemByIssueRequestsIdListResult>
        {
            Code = StatusCodes.Status200OK,
            Message = $"Success executing {nameof(GetIssueRequestsItemByIssueRequestsIdListAsync)}",
            Content = response
        });
    }


}


