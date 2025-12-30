using Application.Common.Repositories;
using Application.Features.InventoryTransactionManager;
using Domain.Entities;
using Domain.Enums;
using FluentValidation;
using MediatR;

namespace Application.Features.GoodsExamineManager.Commands;

public class UpdateGoodsExamineResult
{
    public GoodsExamine? Data { get; set; }
}

public class UpdateGoodsExamineRequest : IRequest<UpdateGoodsExamineResult>
{
    public string? Id { get; init; }
    public DateTime? ExamineDate { get; init; }
    public string? Status { get; init; }
    public string? Description { get; init; }
    public string? PurchaseOrderId { get; init; }
    public string? UpdatedById { get; init; }
    public ExamineCommiteeDto? Committee { get; init; }
}

public class UpdateGoodsExamineValidator : AbstractValidator<UpdateGoodsExamineRequest>
{
    public UpdateGoodsExamineValidator()
    {
        RuleFor(x => x.Id).NotEmpty();
        RuleFor(x => x.ExamineDate).NotEmpty();
        RuleFor(x => x.Status).NotEmpty();
        RuleFor(x => x.PurchaseOrderId).NotEmpty();
    }
}

public class UpdateGoodsExamineHandler : IRequestHandler<UpdateGoodsExamineRequest, UpdateGoodsExamineResult>
{
    private readonly ICommandRepository<GoodsExamine> _repository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly InventoryTransactionService _inventoryTransactionService;

    public UpdateGoodsExamineHandler(
        ICommandRepository<GoodsExamine> repository,
        IUnitOfWork unitOfWork,
        InventoryTransactionService inventoryTransactionService
        )
    {
        _repository = repository;
        _unitOfWork = unitOfWork;
        _inventoryTransactionService = inventoryTransactionService;
    }

    public async Task<UpdateGoodsExamineResult> Handle(UpdateGoodsExamineRequest request, CancellationToken cancellationToken)
    {

        var entity = await _repository.GetAsync(request.Id ?? string.Empty, cancellationToken);

        if (entity == null)
        {
            throw new Exception($"Entity not found: {request.Id}");
        }

        entity.UpdatedById = request.UpdatedById;

        entity.ExamineDate = request.ExamineDate;
        entity.Status = (GoodsExamineStatus)int.Parse(request.Status!);
        entity.Description = request.Description;
        entity.PurchaseOrderId = request.PurchaseOrderId;
       
        _repository.Update(entity);
        await _unitOfWork.SaveAsync(cancellationToken);

        await _inventoryTransactionService.PropagateParentUpdate(
            entity.Id,
            nameof(GoodsExamine),
            entity.ExamineDate,
            (InventoryTransactionStatus?)entity.Status,
            entity.IsDeleted,
            entity.UpdatedById,
            null,
            cancellationToken
            );

        return new UpdateGoodsExamineResult
        {
            Data = entity
        };
    }
}

