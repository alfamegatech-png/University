using Application.Common.Repositories;
using Domain.Entities;
using Domain.Enums;
using FluentValidation;
using MediatR;

namespace Application.Features.IssueRequestsManager.Commands;

public class UpdateIssueRequestsResult
{
    public IssueRequests? Data { get; set; }
}

public class UpdateIssueRequestsRequest : IRequest<UpdateIssueRequestsResult>
{
    public string? Id { get; init; }
    public DateTime? OrderDate { get; init; }
    public string? OrderStatus { get; init; }
    public string? Description { get; init; }
    public string? EmployeeId { get; init; }
    public string? TaxId { get; init; }
    public string? UpdatedById { get; init; }
}

public class UpdateIssueRequestsValidator : AbstractValidator<UpdateIssueRequestsRequest>
{
    public UpdateIssueRequestsValidator()
    {
        RuleFor(x => x.Id).NotEmpty();
        RuleFor(x => x.OrderDate).NotEmpty();
        RuleFor(x => x.OrderStatus).NotEmpty();
        RuleFor(x => x.EmployeeId).NotEmpty();
        //RuleFor(x => x.TaxId).NotEmpty();
    }
}

public class UpdateIssueRequestsHandler : IRequestHandler<UpdateIssueRequestsRequest, UpdateIssueRequestsResult>
{
    private readonly ICommandRepository<IssueRequests> _repository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IssueRequestsService _IssueRequestsService;

    public UpdateIssueRequestsHandler(
        ICommandRepository<IssueRequests> repository,
        IssueRequestsService IssueRequestsService,
        IUnitOfWork unitOfWork
        )
    {
        _repository = repository;
        _unitOfWork = unitOfWork;
        _IssueRequestsService = IssueRequestsService;
    }

    public async Task<UpdateIssueRequestsResult> Handle(UpdateIssueRequestsRequest request, CancellationToken cancellationToken)
    {

        var entity = await _repository.GetAsync(request.Id ?? string.Empty, cancellationToken);

        if (entity == null)
        {
            throw new Exception($"Entity not found: {request.Id}");
        }

        entity.UpdatedById = request.UpdatedById;

        entity.OrderDate = request.OrderDate;
        entity.OrderStatus = (SalesOrderStatus)int.Parse(request.OrderStatus!);
        entity.Description = request.Description;
        entity.EmployeeId = request.EmployeeId;
        entity.TaxId = request.TaxId;

        _repository.Update(entity);
        await _unitOfWork.SaveAsync(cancellationToken);

        _IssueRequestsService.Recalculate(entity.Id);

        return new UpdateIssueRequestsResult
        {
            Data = entity
        };
    }
}

