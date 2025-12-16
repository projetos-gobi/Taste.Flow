namespace TasteFlow.Application.SubCategory.Responses
{
    public record CheckSubCategoriesExistResponse
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
    }
}
