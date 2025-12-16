using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Domain.Entities;
using TasteFlow.Domain.Interfaces;
using TasteFlow.Infrastructure.Repositories.Base;

namespace TasteFlow.Infrastructure.Repositories
{
    public class EnterpriseRelationshipRepository : BaseRepository<EnterpriseRelationship>, IEnterpriseRelationshipRepository
    {
        public EnterpriseRelationshipRepository(TasteFlowContext context) : base(context)
        {
        }
    }
}
