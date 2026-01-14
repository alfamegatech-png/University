using Application.Common.Extensions;
using Domain.Entities;
using Domain.Enums;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics;

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
            Status = item.IssueRequests.OrderStatus.HasValue? (InventoryTransactionStatus?)(int)item.IssueRequests.OrderStatus.Value: null,

            //Status = item.IssueRequests.OrderStatus, //InventoryTransactionStatus.Confirmed,

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

        //هنعدل بس لو حالة الطلب draft
        if (child.Status != InventoryTransactionStatus.Draft)
            throw new Exception("Cannot edit inventory after confirmation");

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
        string? ProductId,
        CancellationToken cancellationToken = default
        )
    {
        var childs = await _queryContext
            .InventoryTransaction
            .AsNoTracking()
            .ApplyIsDeletedFilter(false)
            .Where(x => x.ModuleId == moduleId && x.ModuleName == moduleName && x.ProductId== ProductId && x.Status!= InventoryTransactionStatus.Cancelled)
            .ToListAsync(cancellationToken);

        return childs;
    }



    //لو الissue request اتقفل و بقا confirmed نعدل ال inventory transaction confirmed برده
    public async Task ConfirmIssueRequestAsync(
           string issueRequestId,
           string updatedById,
           CancellationToken cancellationToken = default)
    {
        var transactions = await _queryContext.InventoryTransaction
            .Where(x =>
                x.ModuleId == issueRequestId &&
                x.ModuleName == nameof(IssueRequests) &&
                x.Status == InventoryTransactionStatus.Draft)
            .ToListAsync(cancellationToken);

        foreach (var trans in transactions)
        {
            trans.Status = InventoryTransactionStatus.Confirmed;
            trans.UpdatedById = updatedById;

            CalculateInvenTrans(trans);
            _inventoryTransactionRepository.Update(trans);
        }

        await _unitOfWork.SaveAsync(cancellationToken);
    }



}