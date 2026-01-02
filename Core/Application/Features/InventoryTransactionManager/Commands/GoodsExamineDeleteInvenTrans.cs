using Domain.Entities;
using FluentValidation;
using MediatR;

namespace Application.Features.InventoryTransactionManager.Commands;

public class GoodsExamineDeleteInvenTransResult
{
    public InventoryTransaction? Data { get; set; }
}

public class GoodsExamineDeleteInvenTransRequest : IRequest<GoodsExamineDeleteInvenTransResult>
{
    public string? Id { get; init; }
    public string? DeletedById { get; init; }

}

public class GoodsExamineDeleteInvenTransValidator : AbstractValidator<GoodsExamineDeleteInvenTransRequest>
{
    public GoodsExamineDeleteInvenTransValidator()
    {
        RuleFor(x => x.Id).NotEmpty();
        RuleFor(x => x.DeletedById).NotEmpty();
    }
}

public class GoodsExamineDeleteInvenTransHandler : IRequestHandler<GoodsExamineDeleteInvenTransRequest, GoodsExamineDeleteInvenTransResult>
{
    private readonly InventoryTransactionService _inventoryTransactionService;

    public GoodsExamineDeleteInvenTransHandler(
        InventoryTransactionService inventoryTransactionService
        )
    {
        _inventoryTransactionService = inventoryTransactionService;
    }

    public async Task<GoodsExamineDeleteInvenTransResult> Handle(GoodsExamineDeleteInvenTransRequest request, CancellationToken cancellationToken = default)
    {
        var entity = await _inventoryTransactionService.GoodsExamineDeleteInvenTrans(
            request.Id,
            request.DeletedById,
            cancellationToken);

        return new GoodsExamineDeleteInvenTransResult
        {
            Data = entity
        };
    }
}