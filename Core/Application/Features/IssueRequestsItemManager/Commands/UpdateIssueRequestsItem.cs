using Application.Common.Repositories;
using Application.Features.InventoryTransactionManager;
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
    public string? WarehouseId { get; init; }
    public string? Summary { get; init; }
    public double? UnitPrice { get; init; }
    public double? AvailableQuantity { get; init; }
    public double? SuppliedQuantity { get; init; }
    public double? RequestedQuantity { get; set; } 
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
        RuleFor(x => x.AvailableQuantity).NotEmpty();
        RuleFor(x => x.SuppliedQuantity).NotEmpty();
        RuleFor(x => x.RequestedQuantity).NotEmpty();
    }
}

public class UpdateIssueRequestsItemHandler : IRequestHandler<UpdateIssueRequestsItemRequest, UpdateIssueRequestsItemResult>
{
    private readonly ICommandRepository<IssueRequestsItem> _repository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IssueRequestsService _IssueRequestsService;
    private readonly InventoryTransactionService _inventoryTransactionService;

    public UpdateIssueRequestsItemHandler(
        ICommandRepository<IssueRequestsItem> repository,
        IUnitOfWork unitOfWork,
        IssueRequestsService IssueRequestsService, InventoryTransactionService inventoryTransactionService
        )
    {
        _repository = repository;
        _unitOfWork = unitOfWork;
        _IssueRequestsService = IssueRequestsService;
        _inventoryTransactionService = inventoryTransactionService;

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
        entity.AvailableQuantity = request.AvailableQuantity;
        entity.SuppliedQuantity = request.SuppliedQuantity;
        entity.RequestedQuantity = request.RequestedQuantity;

        entity.Total = entity.UnitPrice * entity.SuppliedQuantity;

        _repository.Update(entity);
        await _unitOfWork.SaveAsync(cancellationToken);

        // 2. Get related inventory transaction
        var trans = await _inventoryTransactionService
            .IssueRequestGetInvenTransList(
                entity.IssueRequestsId,
                nameof(IssueRequests),
                cancellationToken
            );

        var existingTrans = trans.SingleOrDefault();

        // 3. Update or create
        if ((entity.SuppliedQuantity ?? 0) > 0)
        {
            if (existingTrans == null)
            {
                await _inventoryTransactionService.IssueRequestCreateInvenTrans(
                    entity.Id,
                    request.WarehouseId!,
                    entity.ProductId!,
                    entity.SuppliedQuantity,
                    request.UpdatedById,
                    cancellationToken
                );
            }
            else
            {
                await _inventoryTransactionService.IssueRequestUpdateInvenTrans(
                    existingTrans.Id,
                    request.WarehouseId,
                    entity.ProductId,
                    entity.SuppliedQuantity,
                    request.UpdatedById,
                    cancellationToken
                );
            }
        }
        else if (existingTrans != null)
        {
            // SuppliedQuantity changed to 0
            await _inventoryTransactionService.IssueRequestDeleteInvenTrans(
                existingTrans.Id,
                request.UpdatedById,
                cancellationToken
            );
        }


        _IssueRequestsService.Recalculate(entity.IssueRequestsId ?? "");

        return new UpdateIssueRequestsItemResult
        {
            Data = entity
        };
    }
}

