namespace TasteFlow.Application.ProductType.Responses
{
    public record CheckProductTypesExistResponse
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
    }
}
