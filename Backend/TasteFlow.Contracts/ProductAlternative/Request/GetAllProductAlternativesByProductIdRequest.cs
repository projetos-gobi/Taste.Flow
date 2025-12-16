namespace TasteFlow.Contracts.ProductAlternative.Request
{
    public record GetAllProductAlternativesByProductIdRequest
    {
        public Guid ProductId { get; set; }
    }
}
