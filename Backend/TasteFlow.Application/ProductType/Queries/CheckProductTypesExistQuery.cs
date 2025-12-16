using MediatR;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Application.ProductType.Responses;

namespace TasteFlow.Application.ProductType.Queries
{
    public record CheckProductTypesExistQuery : IRequest<IEnumerable<CheckProductTypesExistResponse>>
    {
        public IEnumerable<string> ProductTypes { get; set; }
        public Guid EnterpriseId { get; set; }
    }
}
