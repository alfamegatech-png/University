using Application.Common.Repositories;
using Domain.Entities;
using FluentValidation;
using MediatR;

namespace Application.Features.EmployeeManager.Commands;

public class DeleteEmployeeResult
{
    public Employee? Data { get; set; }
}

public class DeleteEmployeeRequest : IRequest<DeleteEmployeeResult>
{
    public string? Id { get; init; }
    public string? DeletedById { get; init; }
}

public class DeleteEmployeeValidator : AbstractValidator<DeleteEmployeeRequest>
{
    public DeleteEmployeeValidator()
    {
        RuleFor(x => x.Id).NotEmpty();
    }
}

public class DeleteEmployeeHandler : IRequestHandler<DeleteEmployeeRequest, DeleteEmployeeResult>
{
    private readonly ICommandRepository<Employee> _repository;
    private readonly IUnitOfWork _unitOfWork;

    public DeleteEmployeeHandler(
        ICommandRepository<Employee> repository,
        IUnitOfWork unitOfWork
        )
    {
        _repository = repository;
        _unitOfWork = unitOfWork;
    }

    public async Task<DeleteEmployeeResult> Handle(DeleteEmployeeRequest request, CancellationToken cancellationToken)
    {

        var entity = await _repository.GetAsync(request.Id ?? string.Empty, cancellationToken);

        if (entity == null)
        {
            throw new Exception($"Entity not found: {request.Id}");
        }

        entity.UpdatedById = request.DeletedById;

        _repository.Delete(entity);
        await _unitOfWork.SaveAsync(cancellationToken);

        return new DeleteEmployeeResult
        {
            Data = entity
        };
    }
}

