using Application.Common.Repositories;
using Application.Features.IssueRequestsManager;
using Domain.Entities;
using FluentValidation;
using MediatR;

namespace Application.Features.IssueRequestsItemManager.Commands;

public class CreateIssueRequestsItemResult
{
    public IssueRequestsItem? Data { get; set; }
}

public class CreateIssueRequestsItemRequest : IRequest<CreateIssueRequestsItemResult>
{
    public string? IssueRequestsId { get; init; }
    public string? ProductId { get; init; }
    public string? Summary { get; init; }
    public double? UnitPrice { get; init; }
    public double? Quantity { get; init; }
    public double? RequestedQuantity { get; set; } 
    public string? CreatedById { get; init; }
}

public class CreateIssueRequestsItemValidator : AbstractValidator<CreateIssueRequestsItemRequest>
{
    public CreateIssueRequestsItemValidator()
    {
        RuleFor(x => x.IssueRequestsId).NotEmpty();
        RuleFor(x => x.ProductId).NotEmpty();
        RuleFor(x => x.UnitPrice).NotEmpty();
        RuleFor(x => x.Quantity).NotEmpty();
        RuleFor(x => x.RequestedQuantity).NotEmpty();
    }
}

public class CreateIssueRequestsItemHandler : IRequestHandler<CreateIssueRequestsItemRequest, CreateIssueRequestsItemResult>
{
    private readonly ICommandRepository<IssueRequestsItem> _repository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IssueRequestsService _IssueRequestsService;

    public CreateIssueRequestsItemHandler(
        ICommandRepository<IssueRequestsItem> repository,
        IUnitOfWork unitOfWork,
        IssueRequestsService IssueRequestsService
        )
    {
        _repository = repository;
        _unitOfWork = unitOfWork;
        _IssueRequestsService = IssueRequestsService;
    }

    public async Task<CreateIssueRequestsItemResult> Handle(CreateIssueRequestsItemRequest request, CancellationToken cancellationToken = default)
    {
        var entity = new IssueRequestsItem();
        entity.CreatedById = request.CreatedById;

        entity.IssueRequestsId = request.IssueRequestsId;
        entity.ProductId = request.ProductId;
        entity.Summary = request.Summary;
        entity.UnitPrice = request.UnitPrice;
        entity.Quantity = request.Quantity;
        entity.RequestedQuantity = request.RequestedQuantity;

        entity.Total = entity.Quantity * entity.UnitPrice;

        await _repository.CreateAsync(entity, cancellationToken);
        await _unitOfWork.SaveAsync(cancellationToken);

        _IssueRequestsService.Recalculate(entity.IssueRequestsId ?? "");

        return new CreateIssueRequestsItemResult
        {
            Data = entity
        };
    }
}