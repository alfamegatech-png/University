using Application.Common.Repositories;
using Domain.Entities;
using FluentValidation;
using MediatR;

namespace Application.Features.DepartmentManager.Commands;

public class UpdateDepartmentResult
{
    public Department? Data { get; set; }
}

public class UpdateDepartmentRequest : IRequest<UpdateDepartmentResult>
{
    public string? Id { get; init; }
    public string? Name { get; set; }
    public string? Description { get; set; }
    public string? CreatedById { get; init; }
    public string? UpdatedById { get; init; }
}

public class UpdateDepartmentValidator : AbstractValidator<UpdateDepartmentRequest>
{
    public UpdateDepartmentValidator()
    {
        RuleFor(x => x.Id).NotEmpty();
        RuleFor(x => x.Name).NotEmpty();
   
  
    }
}

public class UpdateDepartmentHandler : IRequestHandler<UpdateDepartmentRequest, UpdateDepartmentResult>
{
    private readonly ICommandRepository<Department> _repository;
    private readonly IUnitOfWork _unitOfWork;

    public UpdateDepartmentHandler(
        ICommandRepository<Department> repository,
        IUnitOfWork unitOfWork
        )
    {
        _repository = repository;
        _unitOfWork = unitOfWork;
    }

    public async Task<UpdateDepartmentResult> Handle(UpdateDepartmentRequest request, CancellationToken cancellationToken)
    {

        var entity = await _repository.GetAsync(request.Id ?? string.Empty, cancellationToken);

        if (entity == null)
        {
            throw new Exception($"Entity not found: {request.Id}");
        }

        entity.UpdatedById = request.UpdatedById;

        entity.Name = request.Name;
        entity.Description = request.Description;
     


        _repository.Update(entity);
        await _unitOfWork.SaveAsync(cancellationToken);

        return new UpdateDepartmentResult
        {
            Data = entity
        };
    }
}

