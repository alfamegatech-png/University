using Application.Common.Repositories;
using Domain.Entities;
using FluentValidation;
using MediatR;

namespace Application.Features.IssueRequestsManager.Commands;

public class DeleteIssueRequestsResult
{
    public IssueRequests? Data { get; set; }
}

public class DeleteIssueRequestsRequest : IRequest<DeleteIssueRequestsResult>
{
    public string? Id { get; init; }
    public string? DeletedById { get; init; }
}

public class DeleteIssueRequestsValidator : AbstractValidator<DeleteIssueRequestsRequest>
{
    public DeleteIssueRequestsValidator()
    {
        RuleFor(x => x.Id).NotEmpty();
    }
}

public class DeleteIssueRequestsHandler : IRequestHandler<DeleteIssueRequestsRequest, DeleteIssueRequestsResult>
{
    private readonly ICommandRepository<IssueRequests> _repository;
    private readonly IUnitOfWork _unitOfWork;

    public DeleteIssueRequestsHandler(
        ICommandRepository<IssueRequests> repository,
        IUnitOfWork unitOfWork
        )
    {
        _repository = repository;
        _unitOfWork = unitOfWork;
    }

    public async Task<DeleteIssueRequestsResult> Handle(DeleteIssueRequestsRequest request, CancellationToken cancellationToken)
    {

        var entity = await _repository.GetAsync(request.Id ?? string.Empty, cancellationToken);

        if (entity == null)
        {
            throw new Exception($"Entity not found: {request.Id}");
        }

        entity.UpdatedById = request.DeletedById;

        _repository.Delete(entity);
        await _unitOfWork.SaveAsync(cancellationToken);

        return new DeleteIssueRequestsResult
        {
            Data = entity
        };
    }
}

