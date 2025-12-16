using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Application.Product.Responses;

namespace TasteFlow.Application.Product.Queries
{
    public record GetAllProductsBySearchTermQuery : IRequest<IEnumerable<GetAllProductsBySearchTermResponse>>
    {
        public string SearchTerm { get; set; }
        public Guid EnterpriseId { get; set; }
    }
}
