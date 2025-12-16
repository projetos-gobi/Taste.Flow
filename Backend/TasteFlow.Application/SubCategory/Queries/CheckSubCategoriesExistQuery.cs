using MediatR;
using TasteFlow.Application.SubCategory.Responses;

namespace TasteFlow.Application.SubCategory.Queries
{
    public record CheckSubCategoriesExistQuery : IRequest<IEnumerable<CheckSubCategoriesExistResponse>>
    {
        public IEnumerable<string> SubCategories { get; set; }
        public Guid EnterpriseId { get; set; }
    }
}
