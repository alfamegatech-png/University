using Application.Features.EmployeeManager.Commands;
using Application.Features.EmployeeManager.Queries;
using ASPNET.BackEnd.Common.Base;
using ASPNET.BackEnd.Common.Models;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ASPNET.BackEnd.Controllers;

[Route("api/[controller]")]
public class EmployeeController : BaseApiController
{
    public EmployeeController(ISender sender) : base(sender)
    {
    }

    [Authorize]
    [HttpPost("CreateEmployee")]
    public async Task<ActionResult<ApiSuccessResult<CreateEmployeeResult>>> CreateEmployeeAsync(CreateEmployeeRequest request, CancellationToken cancellationToken)
    {
        var response = await _sender.Send(request, cancellationToken);

        return Ok(new ApiSuccessResult<CreateEmployeeResult>
        {
            Code = StatusCodes.Status200OK,
            Message = $"Success executing {nameof(CreateEmployeeAsync)}",
            Content = response
        });
    }

    [Authorize]
    [HttpPost("UpdateEmployee")]
    public async Task<ActionResult<ApiSuccessResult<UpdateEmployeeResult>>> UpdateEmployeeAsync(UpdateEmployeeRequest request, CancellationToken cancellationToken)
    {
        var response = await _sender.Send(request, cancellationToken);

        return Ok(new ApiSuccessResult<UpdateEmployeeResult>
        {
            Code = StatusCodes.Status200OK,
            Message = $"Success executing {nameof(UpdateEmployeeAsync)}",
            Content = response
        });
    }

    [Authorize]
    [HttpPost("DeleteEmployee")]
    public async Task<ActionResult<ApiSuccessResult<DeleteEmployeeResult>>> DeleteEmployeeAsync(DeleteEmployeeRequest request, CancellationToken cancellationToken)
    {
        var response = await _sender.Send(request, cancellationToken);

        return Ok(new ApiSuccessResult<DeleteEmployeeResult>
        {
            Code = StatusCodes.Status200OK,
            Message = $"Success executing {nameof(DeleteEmployeeAsync)}",
            Content = response
        });
    }

    [Authorize]
    [HttpGet("GetEmployeeList")]
    public async Task<ActionResult<ApiSuccessResult<GetEmployeeListResult>>> GetEmployeeListAsync(
        CancellationToken cancellationToken,
        [FromQuery] bool isDeleted = false
        )
    {
        var request = new GetEmployeeListRequest { IsDeleted = isDeleted };
        var response = await _sender.Send(request, cancellationToken);

        return Ok(new ApiSuccessResult<GetEmployeeListResult>
        {
            Code = StatusCodes.Status200OK,
            Message = $"Success executing {nameof(GetEmployeeListAsync)}",
            Content = response
        });
    }


}


