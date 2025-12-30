using Application.Features.DepartmentManager.Commands;
using Application.Features.DepartmentManager.Queries;
using ASPNET.BackEnd.Common.Base;
using ASPNET.BackEnd.Common.Models;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ASPNET.BackEnd.Controllers;

[Route("api/[controller]")]
public class DepartmentController : BaseApiController
{
    public DepartmentController(ISender sender) : base(sender)
    {
    }

    [Authorize]
    [HttpPost("CreateDepartment")]
    public async Task<ActionResult<ApiSuccessResult<CreateDepartmentResult>>> CreateDepartmentAsync(CreateDepartmentRequest request, CancellationToken cancellationToken)
    {
        var response = await _sender.Send(request, cancellationToken);

        return Ok(new ApiSuccessResult<CreateDepartmentResult>
        {
            Code = StatusCodes.Status200OK,
            Message = $"Success executing {nameof(CreateDepartmentAsync)}",
            Content = response
        });
    }

    [Authorize]
    [HttpPost("UpdateDepartment")]
    public async Task<ActionResult<ApiSuccessResult<UpdateDepartmentResult>>> UpdateDepartmentAsync(UpdateDepartmentRequest request, CancellationToken cancellationToken)
    {
        var response = await _sender.Send(request, cancellationToken);

        return Ok(new ApiSuccessResult<UpdateDepartmentResult>
        {
            Code = StatusCodes.Status200OK,
            Message = $"Success executing {nameof(UpdateDepartmentAsync)}",
            Content = response
        });
    }

    [Authorize]
    [HttpPost("DeleteDepartment")]
    public async Task<ActionResult<ApiSuccessResult<DeleteDepartmentResult>>> DeleteDepartmentAsync(DeleteDepartmentRequest request, CancellationToken cancellationToken)
    {
        var response = await _sender.Send(request, cancellationToken);

        return Ok(new ApiSuccessResult<DeleteDepartmentResult>
        {
            Code = StatusCodes.Status200OK,
            Message = $"Success executing {nameof(DeleteDepartmentAsync)}",
            Content = response
        });
    }

    [Authorize]
    [HttpGet("GetDepartmentList")]
    public async Task<ActionResult<ApiSuccessResult<GetDepartmentListResult>>> GetDepartmentListAsync(
        CancellationToken cancellationToken,
        [FromQuery] bool isDeleted = false
        )
    {
        var request = new GetDepartmentListRequest { IsDeleted = isDeleted };
        var response = await _sender.Send(request, cancellationToken);

        return Ok(new ApiSuccessResult<GetDepartmentListResult>
        {
            Code = StatusCodes.Status200OK,
            Message = $"Success executing {nameof(GetDepartmentListAsync)}",
            Content = response
        });
    }


}


