using Application.Common.Repositories;
using Application.Features.IssueRequestsManager;
using Domain.Entities;
using FluentValidation;
using MediatR;

namespace Application.Features.IssueRequestsItemManager.Commands;

public class UpdateIssueRequestsItemResult
{
    public IssueRequestsItem? Data { get; set; }
}

public class UpdateIssueRequestsItemRequest : IRequest<UpdateIssueRequestsItemResult>
{
    public string? Id { get; init; }
    public string? IssueRequestsId { get; init; }
    public string? ProductId { get; init; }
    public string? Summary { get; init; }
    public double? UnitPrice { get; init; }
    public double? Quantity { get; init; }
    public string? UpdatedById { get; init; }
}

public class UpdateIssueRequestsItemValidator : AbstractValidator<UpdateIssueRequestsItemRequest>
{
    public UpdateIssueRequestsItemValidator()
    {
        RuleFor(x => x.Id).NotEmpty();
        RuleFor(x => x.IssueRequestsId).NotEmpty();
        RuleFor(x => x.ProductId).NotEmpty();
        RuleFor(x => x.UnitPrice).NotEmpty();
        RuleFor(x => x.Quantity).NotEmpty();
    }
}

public class UpdateIssueRequestsItemHandler : IRequestHandler<UpdateIssueRequestsItemRequest, UpdateIssueRequestsItemResult>
{
    private readonly ICommandRepository<IssueRequestsItem> _repository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IssueRequestsService _IssueRequestsService;

    public UpdateIssueRequestsItemHandler(
        ICommandRepository<IssueRequestsItem> repository,
        IUnitOfWork unitOfWork,
        IssueRequestsService IssueRequestsService
        )
    {
        _repository = repository;
        _unitOfWork = unitOfWork;
        _IssueRequestsService = IssueRequestsService;
    }

    public async Task<UpdateIssueRequestsItemResult> Handle(UpdateIssueRequestsItemRequest request, CancellationToken cancellationToken)
    {

        var entity = await _repository.GetAsync(request.Id ?? string.Empty, cancellationToken);

        if (entity == null)
        {
            throw new Exception($"Entity not found: {request.Id}");
        }

        entity.UpdatedById = request.UpdatedById;

        entity.IssueRequestsId = request.IssueRequestsId;
        entity.ProductId = request.ProductId;
        entity.Summary = request.Summary;
        entity.UnitPrice = request.UnitPrice;
        entity.Quantity = request.Quantity;

        entity.Total = entity.UnitPrice * entity.Quantity;

        _repository.Update(entity);
        await _unitOfWork.SaveAsync(cancellationToken);

        _IssueRequestsService.Recalculate(entity.IssueRequestsId ?? "");

        return new UpdateIssueRequestsItemResult
        {
            Data = entity
        };
    }
}

