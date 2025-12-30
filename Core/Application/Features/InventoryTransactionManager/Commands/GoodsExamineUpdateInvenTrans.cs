using Domain.Entities;
using FluentValidation;
using MediatR;

namespace Application.Features.InventoryTransactionManager.Commands;

public class GoodsExamineUpdateInvenTransResult
{
    public InventoryTransaction? Data { get; set; }
}

public class GoodsExamineUpdateInvenTransRequest : IRequest<GoodsExamineUpdateInvenTransResult>
{
    public string? Id { get; init; }
    public string? WarehouseId { get; init; }
    public string? ProductId { get; init; }
    public double? Movement { get; init; }
    public string? UpdatedById { get; init; }

}

public class GoodsExamineUpdateInvenTransValidator : AbstractValidator<GoodsExamineUpdateInvenTransRequest>
{
    public GoodsExamineUpdateInvenTransValidator()
    {
        RuleFor(x => x.Id).NotEmpty();
        RuleFor(x => x.WarehouseId).NotEmpty();
        RuleFor(x => x.ProductId).NotEmpty();
        RuleFor(x => x.Movement).NotEmpty();
        RuleFor(x => x.UpdatedById).NotEmpty();
    }
}

public class GoodsExamineUpdateInvenTransHandler : IRequestHandler<GoodsExamineUpdateInvenTransRequest, GoodsExamineUpdateInvenTransResult>
{
    private readonly InventoryTransactionService _inventoryTransactionService;

    public GoodsExamineUpdateInvenTransHandler(
        InventoryTransactionService inventoryTransactionService
        )
    {
        _inventoryTransactionService = inventoryTransactionService;
    }

    public async Task<GoodsExamineUpdateInvenTransResult> Handle(GoodsExamineUpdateInvenTransRequest request, CancellationToken cancellationToken = default)
    {
        var entity = await _inventoryTransactionService.GoodsExamineUpdateInvenTrans(
            request.Id,
            request.WarehouseId,
            request.ProductId,
            request.Movement,
            request.UpdatedById,
            cancellationToken);

        return new GoodsExamineUpdateInvenTransResult
        {
            Data = entity
        };
    }
}