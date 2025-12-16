namespace TasteFlow.Contracts.CategoryType.Request
{
    public record CheckCategoryTypesExistRequest
    {
        public IEnumerable<string> CategoryTypes { get; set; }
    }
}
