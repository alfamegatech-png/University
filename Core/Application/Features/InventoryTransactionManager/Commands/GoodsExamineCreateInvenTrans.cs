using Domain.Entities;
using FluentValidation;
using MediatR;

namespace Application.Features.InventoryTransactionManager.Commands;

public class GoodsExamineCreateInvenTransResult
{
    public InventoryTransaction? Data { get; set; }
}

public class GoodsExamineCreateInvenTransRequest : IRequest<GoodsExamineCreateInvenTransResult>
{
    public string? ModuleId { get; init; }
    public string? WarehouseId { get; init; }
    public string? ProductId { get; init; }
    public double? Movement { get; init; }
    public string? CreatedById { get; init; }
}

public class GoodsExamineCreateInvenTransValidator : AbstractValidator<GoodsExamineCreateInvenTransRequest>
{
    public GoodsExamineCreateInvenTransValidator()
    {
        RuleFor(x => x.ModuleId).NotEmpty();
        RuleFor(x => x.WarehouseId).NotEmpty();
        RuleFor(x => x.ProductId).NotEmpty();
        RuleFor(x => x.Movement).NotEmpty();
        RuleFor(x => x.CreatedById).NotEmpty();
    }
}

public class GoodsExamineCreateInvenTransHandler : IRequestHandler<GoodsExamineCreateInvenTransRequest, GoodsExamineCreateInvenTransResult>
{
    private readonly InventoryTransactionService _inventoryTransactionService;

    public GoodsExamineCreateInvenTransHandler(
        InventoryTransactionService inventoryTransactionService
        )
    {
        _inventoryTransactionService = inventoryTransactionService;
    }

    public async Task<GoodsExamineCreateInvenTransResult> Handle(GoodsExamineCreateInvenTransRequest request, CancellationToken cancellationToken = default)
    {
        var entity = await _inventoryTransactionService.GoodsExamineCreateInvenTrans(
            request.ModuleId,
            request.WarehouseId,
            request.ProductId,
            request.Movement,
            request.CreatedById,
            cancellationToken);

        return new GoodsExamineCreateInvenTransResult
        {
            Data = entity
        };
    }
}