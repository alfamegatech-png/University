using Application.Common.Repositories;
using Application.Features.InventoryTransactionManager;
using Application.Features.IssueRequestsManager;
using Domain.Entities;
using FluentValidation;
using MediatR;
using Application.Common.Extensions;
using Microsoft.EntityFrameworkCore;



namespace Application.Features.IssueRequestsItemManager.Commands;

public class CreateIssueRequestsItemResult
{
    public IssueRequestsItem? Data { get; set; }
}

public class CreateIssueRequestsItemRequest : IRequest<CreateIssueRequestsItemResult>
{
    public string? IssueRequestsId { get; init; }
    public string? ProductId { get; init; }
    public string? WarehouseId { get; init; }
    public string? Summary { get; init; }
    public double? UnitPrice { get; init; }
    public double? AvailableQuantity { get; init; }
    public double? SuppliedQuantity { get; set; }

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
        RuleFor(x => x.AvailableQuantity).NotEmpty();
        RuleFor(x => x.RequestedQuantity).NotEmpty();
        RuleFor(x => x.SuppliedQuantity).NotEmpty();
    }
}

public class CreateIssueRequestsItemHandler : IRequestHandler<CreateIssueRequestsItemRequest, CreateIssueRequestsItemResult>
{
    private readonly ICommandRepository<IssueRequestsItem> _repository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IssueRequestsService _IssueRequestsService;
    private readonly InventoryTransactionService _inventoryTransactionService;
    private readonly ICommandRepository<Warehouse> _warehouseRepository;
    public CreateIssueRequestsItemHandler(
        ICommandRepository<IssueRequestsItem> repository,
        IUnitOfWork unitOfWork,
        IssueRequestsService IssueRequestsService, ICommandRepository<Warehouse> warehouseRepository,
         InventoryTransactionService inventoryTransactionService
        )
    {
        _repository = repository;
        _unitOfWork = unitOfWork;
        _IssueRequestsService = IssueRequestsService;
        _warehouseRepository = warehouseRepository;
        _inventoryTransactionService = inventoryTransactionService;
    }

    public async Task<CreateIssueRequestsItemResult> Handle(CreateIssueRequestsItemRequest request, CancellationToken cancellationToken = default)
    {
        var entity = new IssueRequestsItem
        {
            CreatedById = request.CreatedById,
            IssueRequestsId = request.IssueRequestsId,
            ProductId = request.ProductId,
            Summary = request.Summary,
            UnitPrice = request.UnitPrice,
            RequestedQuantity = request.RequestedQuantity,
            SuppliedQuantity = request.SuppliedQuantity
        };

        // Calculate total
        entity.Total = (entity.SuppliedQuantity ?? 0) * (entity.UnitPrice ?? 0);

        // Recalculate request totals
        _IssueRequestsService.Recalculate(entity.IssueRequestsId ?? "");

        // Get available stock
        if (request.WarehouseId == null || request.ProductId == null)
        {
            entity.AvailableQuantity = 0;
        }
        else
        {
            var stock = _inventoryTransactionService.GetStock(
                request.WarehouseId,
                request.ProductId
            );

            entity.AvailableQuantity = stock;
        }

        // Create the entity **once**
        await _repository.CreateAsync(entity, cancellationToken);
        await _unitOfWork.SaveAsync(cancellationToken);

        // Create inventory transaction ONLY if supplied
        if ((entity.SuppliedQuantity ?? 0) > 0)
        {
            var warehouse = await _warehouseRepository
                .GetQuery()
                .ApplyIsDeletedFilter(false)
                .FirstAsync(x => x.SystemWarehouse == false, cancellationToken);

            // Stock validation 
            var currentStock = _inventoryTransactionService.GetStock(
                warehouse.Id,
                entity.ProductId
            );

            if (entity.SuppliedQuantity > currentStock)
                throw new Exception("Supplied quantity exceeds available stock.");

            await _inventoryTransactionService.IssueRequestCreateInvenTrans(
                entity.Id,
                warehouse.Id,
                entity.ProductId,
                entity.SuppliedQuantity,
                request.CreatedById,
                cancellationToken
            );
        }

        return new CreateIssueRequestsItemResult
        {
            Data = entity
        };
    }

}