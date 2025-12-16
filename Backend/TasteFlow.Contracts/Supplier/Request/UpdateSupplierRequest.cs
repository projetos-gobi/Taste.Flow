using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TasteFlow.Contracts.Supplier.Request
{
    public record UpdateSupplierRequest
    {
        public Guid Id { get; set; }
        public Guid CategoryId { get; set; }
        public Guid SubCategoryId { get; set; }
        public string FantasyName { get; set; }
        public string Cnpj { get; set; }
        public string Telephone { get; set; }
        public SupplierPaymentDetailRequest? SupplierPaymentDetail { get; set; }
        public IEnumerable<SupplierPaymentTypeRequest> SupplierPaymentTypes { get; set; }
    }
}
