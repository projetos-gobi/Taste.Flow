using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Application.SupplierPaymentType.Responses;

namespace TasteFlow.Application.Supplier.Responses
{
    public record GetSuppliersPagedResponse
    {
        public Guid Id { get; set; }
        public Guid EnterpriseId { get; set; }
        public Guid CategoryId { get; set; }
        public Guid SubCategoryId { get; set; }
        public string FantasyName { get; set; }
        public string SocialReason { get; set; }
        public string Cnpj { get; set; }
        public string Telephone { get; set; }
        public string CategoryName { get; set; }
        public IEnumerable<SupplierPaymentTypeResponse> SupplierPaymentTypes { get; set; }
    }
}
