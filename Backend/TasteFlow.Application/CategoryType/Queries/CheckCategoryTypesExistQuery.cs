using MediatR;
using TasteFlow.Application.CategoryType.Responses;

namespace TasteFlow.Application.CategoryType.Queries
{
    public record CheckCategoryTypesExistQuery : IRequest<IEnumerable<CheckCategoryTypesExistResponse>>
    {
        public IEnumerable<string> CategoryTypes { get; set; }
        public Guid EnterpriseId { get; set; }
    }
}
