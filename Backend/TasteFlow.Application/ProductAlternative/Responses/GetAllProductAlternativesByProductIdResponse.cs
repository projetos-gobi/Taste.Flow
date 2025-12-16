namespace TasteFlow.Application.ProductAlternative.Responses
{
    public record GetAllProductAlternativesByProductIdResponse
    {
        public Guid Id { get; set; }
        public Guid ProductOriginalId { get; set; }
        public Guid ProductSecondaryId { get; set; }
        public string ProductOriginalName { get; set; }
        public string ProductSecondaryName { get; set; }
        public bool IsActive { get; set; }
    }
}
