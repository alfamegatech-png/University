using Application.Common.Repositories;
using Domain.Entities;
using FluentValidation;
using MediatR;

namespace Application.Features.DepartmentManager.Commands;

public class DeleteDepartmentResult
{
    public Department? Data { get; set; }
}

public class DeleteDepartmentRequest : IRequest<DeleteDepartmentResult>
{
    public string? Id { get; init; }
    public string? DeletedById { get; init; }
}

public class DeleteDepartmentValidator : AbstractValidator<DeleteDepartmentRequest>
{
    public DeleteDepartmentValidator()
    {
        RuleFor(x => x.Id).NotEmpty();
    }
}

public class DeleteDepartmentHandler : IRequestHandler<DeleteDepartmentRequest, DeleteDepartmentResult>
{
    private readonly ICommandRepository<Department> _repository;
    private readonly IUnitOfWork _unitOfWork;

    public DeleteDepartmentHandler(
        ICommandRepository<Department> repository,
        IUnitOfWork unitOfWork
        )
    {
        _repository = repository;
        _unitOfWork = unitOfWork;
    }

    public async Task<DeleteDepartmentResult> Handle(DeleteDepartmentRequest request, CancellationToken cancellationToken)
    {

        var entity = await _repository.GetAsync(request.Id ?? string.Empty, cancellationToken);

        if (entity == null)
        {
            throw new Exception($"Entity not found: {request.Id}");
        }

        entity.UpdatedById = request.DeletedById;

        _repository.Delete(entity);
        await _unitOfWork.SaveAsync(cancellationToken);

        return new DeleteDepartmentResult
        {
            Data = entity
        };
    }
}

