using Domain.Entities;
using FluentValidation;
using MediatR;

namespace Application.Features.InventoryTransactionManager.Queries;

public class GoodsExamineGetInvenTransListResult
{
    public List<InventoryTransaction>? Data { get; set; }
}

public class GoodsExamineGetInvenTransListRequest : IRequest<GoodsExamineGetInvenTransListResult>
{
    public string? ModuleId { get; init; }

}

public class GoodsExamineGetInvenTransListValidator : AbstractValidator<GoodsExamineGetInvenTransListRequest>
{
    public GoodsExamineGetInvenTransListValidator()
    {
        RuleFor(x => x.ModuleId).NotEmpty();
    }
}

public class GoodsExamineGetInvenTransListHandler : IRequestHandler<GoodsExamineGetInvenTransListRequest, GoodsExamineGetInvenTransListResult>
{
    private readonly InventoryTransactionService _inventoryTransactionService;

    public GoodsExamineGetInvenTransListHandler(
        InventoryTransactionService inventoryTransactionService
        )
    {
        _inventoryTransactionService = inventoryTransactionService;
    }

    public async Task<GoodsExamineGetInvenTransListResult> Handle(GoodsExamineGetInvenTransListRequest request, CancellationToken cancellationToken = default)
    {
        var entity = await _inventoryTransactionService.GoodsExamineGetInvenTransList(
            request.ModuleId,
            nameof(GoodsExamine),
            cancellationToken);

        return new GoodsExamineGetInvenTransListResult
        {
            Data = entity
        };
    }
}