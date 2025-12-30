using Application.Common.Repositories;
using Application.Features.InventoryTransactionManager;
using Domain.Entities;
using Domain.Enums;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

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
    public List<ExamineCommiteeDto>? committeeList { get; init; }

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
    private readonly ICommandRepository<ExamineCommitee> _committeeRepository;

    public UpdateGoodsExamineHandler(
        ICommandRepository<GoodsExamine> repository,
        IUnitOfWork unitOfWork,
        InventoryTransactionService inventoryTransactionService, ICommandRepository<ExamineCommitee> committeeRepository
        )
    {
        _repository = repository;
        _unitOfWork = unitOfWork;
        _inventoryTransactionService = inventoryTransactionService;
         _committeeRepository= committeeRepository;
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
       
        // 🧹 حذف اللجان القديمة
        var oldCommittees = await _committeeRepository
            .GetQuery()
            .Where(x => x.GoodsExamineId == entity.Id)
            .ToListAsync(cancellationToken);

        foreach (var old in oldCommittees)
        {
            _committeeRepository.Delete(old);
        }

        // ➕ إضافة اللجان الجديدة
        if (request.committeeList != null && request.committeeList.Any())
        {
            foreach (var committeeDto in request.committeeList)
            {
                var committee = new ExamineCommitee
                {
                    GoodsExamineId = entity.Id,
                    EmployeeID = committeeDto.EmployeeID,
                    EmployeePositionID = committeeDto.EmployeePositionID,
                    EmployeeName = committeeDto.EmployeeName,
                    EmployeePositionName = committeeDto.EmployeePositionName,
                    EmployeeType = committeeDto.EmployeeType,
                    Description = committeeDto.Description,
                    CreatedById = request.UpdatedById
                };

                await _committeeRepository.CreateAsync(committee, cancellationToken);
            }
        }
        
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

