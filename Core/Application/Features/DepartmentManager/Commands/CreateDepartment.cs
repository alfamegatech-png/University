using Application.Common.Repositories;
using Application.Features.NumberSequenceManager;
using Domain.Entities;
using FluentValidation;
using MediatR;

namespace Application.Features.DepartmentManager.Commands;

public class CreateDepartmentResult
{
    public Department? Data { get; set; }
}

public class CreateDepartmentRequest : IRequest<CreateDepartmentResult>
{
    public string? Name { get; set; }
    public string? Description { get; set; }
    public string? CreatedById { get; init; }
}

public class CreateDepartmentValidator : AbstractValidator<CreateDepartmentRequest>
{
    public CreateDepartmentValidator()
    {
        RuleFor(x => x.Name).NotEmpty();
      

    }
}

public class CreateDepartmentHandler : IRequestHandler<CreateDepartmentRequest, CreateDepartmentResult>
{
    private readonly ICommandRepository<Department> _repository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly NumberSequenceService _numberSequenceService;

    public CreateDepartmentHandler(
        ICommandRepository<Department> repository,
        IUnitOfWork unitOfWork,
        NumberSequenceService numberSequenceService
        )
    {
        _repository = repository;
        _unitOfWork = unitOfWork;
        _numberSequenceService = numberSequenceService;
    }

    public async Task<CreateDepartmentResult> Handle(CreateDepartmentRequest request, CancellationToken cancellationToken = default)
    {
        var entity = new Department();
        entity.CreatedById = request.CreatedById;
        entity.Name = request.Name;
        entity.Description = request.Description;


        await _repository.CreateAsync(entity, cancellationToken);
        await _unitOfWork.SaveAsync(cancellationToken);

        return new CreateDepartmentResult
        {
            Data = entity
        };
    }
}