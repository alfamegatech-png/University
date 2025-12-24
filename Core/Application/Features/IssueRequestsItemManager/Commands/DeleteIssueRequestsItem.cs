using Application.Common.Repositories;
using Application.Features.IssueRequestsManager;
using Domain.Entities;
using FluentValidation;
using MediatR;

namespace Application.Features.IssueRequestsItemManager.Commands;

public class DeleteIssueRequestsItemResult
{
    public IssueRequestsItem? Data { get; set; }
}

public class DeleteIssueRequestsItemRequest : IRequest<DeleteIssueRequestsItemResult>
{
    public string? Id { get; init; }
    public string? DeletedById { get; init; }
}

public class DeleteIssueRequestsItemValidator : AbstractValidator<DeleteIssueRequestsItemRequest>
{
    public DeleteIssueRequestsItemValidator()
    {
        RuleFor(x => x.Id).NotEmpty();
    }
}

public class DeleteIssueRequestsItemHandler : IRequestHandler<DeleteIssueRequestsItemRequest, DeleteIssueRequestsItemResult>
{
    private readonly ICommandRepository<IssueRequestsItem> _repository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IssueRequestsService _IssueRequestsService;

    public DeleteIssueRequestsItemHandler(
        ICommandRepository<IssueRequestsItem> repository,
        IUnitOfWork unitOfWork,
        IssueRequestsService IssueRequestsService
        )
    {
        _repository = repository;
        _unitOfWork = unitOfWork;
        _IssueRequestsService = IssueRequestsService;
    }

    public async Task<DeleteIssueRequestsItemResult> Handle(DeleteIssueRequestsItemRequest request, CancellationToken cancellationToken)
    {

        var entity = await _repository.GetAsync(request.Id ?? string.Empty, cancellationToken);

        if (entity == null)
        {
            throw new Exception($"Entity not found: {request.Id}");
        }

        entity.UpdatedById = request.DeletedById;

        _repository.Delete(entity);
        await _unitOfWork.SaveAsync(cancellationToken);

        _IssueRequestsService.Recalculate(entity.IssueRequestsId ?? "");

        return new DeleteIssueRequestsItemResult
        {
            Data = entity
        };
    }
}

