using Application.Common.Extensions;
using Domain.Entities;
using Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.InventoryTransactionManager;

public partial class InventoryTransactionService
{
    public async Task<InventoryTransaction> IssueRequestCreateInvenTrans(
        string issueRequestItemId,
        string warehouseId,
        string productId,
        double? movement,
        string? createdById,
        CancellationToken cancellationToken = default)
    {
        var item = await _queryContext.IssueRequestsItem
            .Include(x => x.IssueRequests)
            .AsNoTracking()
            .SingleOrDefaultAsync(x => x.Id == issueRequestItemId, cancellationToken);

        if (item == null)
            throw new Exception($"IssueRequestItem not found: {issueRequestItemId}");

        var trans = new InventoryTransaction
        {
            CreatedById = createdById,
            Number = _numberSequenceService.GenerateNumber(nameof(InventoryTransaction), "", "IVT"),

            ModuleId = item.IssueRequestsId,
            ModuleName = nameof(IssueRequests),
            ModuleCode = "IR",
            ModuleNumber = item.IssueRequests?.Number,

            MovementDate = item.CreatedAtUtc,
            Status = InventoryTransactionStatus.Confirmed,

            WarehouseId = warehouseId,
            ProductId = productId,
            Movement = movement
        };

        CalculateInvenTrans(trans);

        await _inventoryTransactionRepository.CreateAsync(trans, cancellationToken);
        await _unitOfWork.SaveAsync(cancellationToken);

        return trans;
    }

    public async Task<InventoryTransaction> IssueRequestUpdateInvenTrans(
    string? id,
    string? warehouseId,
    string? productId,
    double? movement,
    string? updatedById,
    CancellationToken cancellationToken = default
    )
    {
        var child = await _inventoryTransactionRepository.GetAsync(id ?? string.Empty, cancellationToken);

        if (child == null)
        {
            throw new Exception($"Child entity not found: {id}");
        }

        child.UpdatedById = updatedById;

        child.WarehouseId = warehouseId;
        child.ProductId = productId;
        child.Movement = movement;

        CalculateInvenTrans(child);

        _inventoryTransactionRepository.Update(child);
        await _unitOfWork.SaveAsync(cancellationToken);

        return child;
    }

    public async Task<InventoryTransaction> IssueRequestDeleteInvenTrans(
        string? id,
        string? updatedById,
        CancellationToken cancellationToken = default
        )
    {
        var child = await _inventoryTransactionRepository.GetAsync(id ?? string.Empty, cancellationToken);

        if (child == null)
        {
            throw new Exception($"Child entity not found: {id}");
        }

        child.UpdatedById = updatedById;

        _inventoryTransactionRepository.Delete(child);
        await _unitOfWork.SaveAsync(cancellationToken);

        return child;
    }
    public async Task<List<InventoryTransaction>> IssueRequestGetInvenTransList(
        string? moduleId,
        string? moduleName,
        CancellationToken cancellationToken = default
        )
    {
        var childs = await _queryContext
            .InventoryTransaction
            .AsNoTracking()
            .ApplyIsDeletedFilter(false)
            .Where(x => x.ModuleId == moduleId && x.ModuleName == moduleName)
            .ToListAsync(cancellationToken);

        return childs;
    }
}