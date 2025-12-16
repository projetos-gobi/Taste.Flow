using MediatR;
using TasteFlow.Application.Category.Responses;

namespace TasteFlow.Application.Category.Queries
{
    public record CheckCategoriesExistQuery : IRequest<IEnumerable<CheckCategoriesExistResponse>>
    {
        public IEnumerable<string> Categories { get; set; }
        public Guid EnterpriseId { get; set; }
    }
}
