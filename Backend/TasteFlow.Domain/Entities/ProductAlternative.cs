using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TasteFlow.Domain.Entities
{
    public class ProductAlternative
    {
        public Guid Id { get; set; }
        public Guid EnterpriseId { get; set; }
        public Guid ProductOriginalId { get; set; }
        public Guid ProductSecondaryId { get; set; }
        public decimal? CostReduction { get; set; }
        public decimal? MarginImprovement { get; set; }
        public DateTime CreatedOn { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public DateTime? DeletedOn { get; set; }
        public Guid CreatedBy { get; set; }
        public Guid? ModifiedBy { get; set; }
        public Guid? DeletedBy { get; set; }
        public bool IsDeleted { get; set; }
        public bool IsActive { get; set; }

        public Enterprise Enterprise { get; set; }
        public Product ProductOriginal { get; set; }
        public Product ProductSecondary { get; set; }
    }
}
